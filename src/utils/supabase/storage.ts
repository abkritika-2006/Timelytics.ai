import { supabase } from './client';

// Storage bucket names
export const STORAGE_BUCKETS = {
  DOCUMENTS: 'documents',
  IMAGES: 'images',
  EXPORTS: 'exports',
  IMPORTS: 'imports'
} as const;

// File upload options
export interface UploadOptions {
  bucket: keyof typeof STORAGE_BUCKETS;
  path: string;
  file: File;
  options?: {
    cacheControl?: string;
    contentType?: string;
    upsert?: boolean;
  };
}

// File download options
export interface DownloadOptions {
  bucket: keyof typeof STORAGE_BUCKETS;
  path: string;
  transform?: {
    width?: number;
    height?: number;
    resize?: 'cover' | 'contain' | 'fill';
    format?: 'webp' | 'png' | 'jpg';
    quality?: number;
  };
}

// Storage response type
export interface StorageResponse<T = any> {
  data: T | null;
  error: string | null;
}

// Storage service class
export class StorageService {
  // Initialize storage buckets
  static async initializeBuckets(): Promise<void> {
    const buckets = Object.values(STORAGE_BUCKETS);
    
    for (const bucket of buckets) {
      try {
        // Check if bucket exists
        const { data: existingBuckets } = await supabase.storage.listBuckets();
        const bucketExists = existingBuckets?.some(b => b.name === bucket);
        
        if (!bucketExists) {
          // Create bucket if it doesn't exist
          await supabase.storage.createBucket(bucket, {
            public: false,
            allowedMimeTypes: this.getAllowedMimeTypes(bucket),
            fileSizeLimit: this.getFileSizeLimit(bucket)
          });
        }
      } catch (error) {
        console.error(`Error initializing bucket ${bucket}:`, error);
      }
    }
  }

  // Upload file
  static async uploadFile({
    bucket,
    path,
    file,
    options = {}
  }: UploadOptions): Promise<StorageResponse<{ path: string; fullPath: string }>> {
    try {
      // Validate file
      const validation = this.validateFile(file, bucket);
      if (!validation.valid) {
        return { data: null, error: validation.error };
      }

      // Generate unique path if needed
      const uniquePath = options.upsert ? path : this.generateUniquePath(path, file.name);
      
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKETS[bucket])
        .upload(uniquePath, file, {
          cacheControl: options.cacheControl || '3600',
          contentType: options.contentType || file.type,
          upsert: options.upsert || false
        });

      if (error) {
        return { data: null, error: error.message };
      }

      return {
        data: {
          path: data.path,
          fullPath: data.fullPath
        },
        error: null
      };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message
      };
    }
  }

  // Download file
  static async downloadFile({
    bucket,
    path,
    transform
  }: DownloadOptions): Promise<StorageResponse<Blob>> {
    try {
      let downloadMethod = supabase.storage.from(STORAGE_BUCKETS[bucket]);
      
      if (transform && bucket === 'IMAGES') {
        // Use image transformation for images
        const { data, error } = await downloadMethod.download(path, {
          transform: {
            width: transform.width,
            height: transform.height,
            resize: transform.resize || 'cover',
            format: transform.format || 'webp',
            quality: transform.quality || 80
          }
        });
        
        return { data, error: error?.message || null };
      } else {
        // Regular download
        const { data, error } = await downloadMethod.download(path);
        return { data, error: error?.message || null };
      }
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message
      };
    }
  }

  // Get public URL
  static getPublicUrl(bucket: keyof typeof STORAGE_BUCKETS, path: string): string {
    const { data } = supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .getPublicUrl(path);
    
    return data.publicUrl;
  }

  // Get signed URL (for private files)
  static async getSignedUrl(
    bucket: keyof typeof STORAGE_BUCKETS,
    path: string,
    expiresIn: number = 3600
  ): Promise<StorageResponse<string>> {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKETS[bucket])
        .createSignedUrl(path, expiresIn);

      return {
        data: data?.signedUrl || null,
        error: error?.message || null
      };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message
      };
    }
  }

  // List files in bucket
  static async listFiles(
    bucket: keyof typeof STORAGE_BUCKETS,
    path: string = '',
    options?: {
      limit?: number;
      offset?: number;
      sortBy?: { column: string; order: 'asc' | 'desc' };
    }
  ): Promise<StorageResponse<any[]>> {
    try {
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKETS[bucket])
        .list(path, {
          limit: options?.limit || 100,
          offset: options?.offset || 0,
          sortBy: options?.sortBy || { column: 'name', order: 'asc' }
        });

      return { data, error: error?.message || null };
    } catch (error) {
      return {
        data: null,
        error: (error as Error).message
      };
    }
  }

  // Delete file
  static async deleteFile(
    bucket: keyof typeof STORAGE_BUCKETS,
    paths: string[]
  ): Promise<StorageResponse<boolean>> {
    try {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKETS[bucket])
        .remove(paths);

      return {
        data: !error,
        error: error?.message || null
      };
    } catch (error) {
      return {
        data: false,
        error: (error as Error).message
      };
    }
  }

  // Move file
  static async moveFile(
    bucket: keyof typeof STORAGE_BUCKETS,
    fromPath: string,
    toPath: string
  ): Promise<StorageResponse<boolean>> {
    try {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKETS[bucket])
        .move(fromPath, toPath);

      return {
        data: !error,
        error: error?.message || null
      };
    } catch (error) {
      return {
        data: false,
        error: (error as Error).message
      };
    }
  }

  // Copy file
  static async copyFile(
    bucket: keyof typeof STORAGE_BUCKETS,
    fromPath: string,
    toPath: string
  ): Promise<StorageResponse<boolean>> {
    try {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKETS[bucket])
        .copy(fromPath, toPath);

      return {
        data: !error,
        error: error?.message || null
      };
    } catch (error) {
      return {
        data: false,
        error: (error as Error).message
      };
    }
  }

  // Validate file before upload
  private static validateFile(
    file: File,
    bucket: keyof typeof STORAGE_BUCKETS
  ): { valid: boolean; error: string } {
    // Check file size
    const maxSize = this.getFileSizeLimit(bucket);
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds limit of ${maxSize / (1024 * 1024)}MB`
      };
    }

    // Check file type
    const allowedTypes = this.getAllowedMimeTypes(bucket);
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed for ${bucket} bucket`
      };
    }

    return { valid: true, error: '' };
  }

  // Get allowed MIME types for bucket
  private static getAllowedMimeTypes(bucket: string): string[] {
    switch (bucket) {
      case STORAGE_BUCKETS.IMAGES:
        return ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
      case STORAGE_BUCKETS.DOCUMENTS:
        return [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'text/plain',
          'text/csv'
        ];
      case STORAGE_BUCKETS.EXPORTS:
        return [
          'application/json',
          'text/csv',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/pdf'
        ];
      case STORAGE_BUCKETS.IMPORTS:
        return [
          'text/csv',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/json'
        ];
      default:
        return ['*/*'];
    }
  }

  // Get file size limit for bucket (in bytes)
  private static getFileSizeLimit(bucket: string): number {
    switch (bucket) {
      case STORAGE_BUCKETS.IMAGES:
        return 5 * 1024 * 1024; // 5MB
      case STORAGE_BUCKETS.DOCUMENTS:
        return 10 * 1024 * 1024; // 10MB
      case STORAGE_BUCKETS.EXPORTS:
        return 50 * 1024 * 1024; // 50MB
      case STORAGE_BUCKETS.IMPORTS:
        return 25 * 1024 * 1024; // 25MB
      default:
        return 10 * 1024 * 1024; // 10MB
    }
  }

  // Generate unique file path
  private static generateUniquePath(basePath: string, fileName: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = fileName.split('.').pop();
    const nameWithoutExtension = fileName.replace(`.${extension}`, '');
    
    return `${basePath}/${nameWithoutExtension}_${timestamp}_${randomString}.${extension}`;
  }
}

// Utility functions for common storage operations
export const uploadTimetableExport = async (file: File, institutionId: string) => {
  return StorageService.uploadFile({
    bucket: 'EXPORTS',
    path: `timetables/${institutionId}`,
    file,
    options: { upsert: false }
  });
};

export const uploadDataImport = async (file: File, institutionId: string, type: string) => {
  return StorageService.uploadFile({
    bucket: 'IMPORTS',
    path: `${type}/${institutionId}`,
    file,
    options: { upsert: false }
  });
};

export const uploadInstitutionLogo = async (file: File, institutionId: string) => {
  return StorageService.uploadFile({
    bucket: 'IMAGES',
    path: `logos/${institutionId}`,
    file,
    options: { upsert: true }
  });
};

export const uploadUserAvatar = async (file: File, userId: string) => {
  return StorageService.uploadFile({
    bucket: 'IMAGES',
    path: `avatars/${userId}`,
    file,
    options: { upsert: true }
  });
};

// Export storage service as default
export default StorageService;