import { GeneratedTimetable, TimetableSlot, Faculty, Course, Room } from '../contexts/AppContext';

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  includeStatistics: boolean;
  includeConflicts: boolean;
  viewType: 'weekly' | 'daily' | 'faculty' | 'room';
  selectedDay?: string;
  selectedFaculty?: string;
  selectedRoom?: string;
}

class TimetableExporter {
  private timetable: GeneratedTimetable;
  private faculty: Faculty[];
  private courses: Course[];
  private rooms: Room[];

  constructor(
    timetable: GeneratedTimetable,
    faculty: Faculty[],
    courses: Course[],
    rooms: Room[]
  ) {
    this.timetable = timetable;
    this.faculty = faculty;
    this.courses = courses;
    this.rooms = rooms;
  }

  private getCourseInfo(courseId: string): Course | undefined {
    return this.courses.find(c => c.id === courseId);
  }

  private getFacultyInfo(facultyId: string): Faculty | undefined {
    return this.faculty.find(f => f.id === facultyId);
  }

  private getRoomInfo(roomId: string): Room | undefined {
    return this.rooms.find(r => r.id === roomId);
  }

  private formatSlotForDisplay(slot: TimetableSlot): any {
    const course = this.getCourseInfo(slot.courseId);
    const faculty = this.getFacultyInfo(slot.facultyId);
    const room = this.getRoomInfo(slot.roomId);

    return {
      id: slot.id,
      courseCode: course?.code || 'N/A',
      courseName: course?.name || 'Unknown Course',
      courseType: course?.type || 'N/A',
      facultyName: faculty?.name || 'Unknown Faculty',
      roomName: room?.name || 'Unknown Room',
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime,
      duration: slot.duration,
      type: slot.type,
      studentCount: slot.studentIds.length
    };
  }

  public generateCSV(options: ExportOptions): string {
    let csvContent = '';

    // Header
    csvContent += 'Course Code,Course Name,Faculty,Room,Day,Start Time,End Time,Duration,Type,Students\n';

    // Filter slots based on options
    let slotsToExport = this.timetable.slots;

    if (options.viewType === 'daily' && options.selectedDay) {
      slotsToExport = slotsToExport.filter(slot => slot.day === options.selectedDay);
    } else if (options.viewType === 'faculty' && options.selectedFaculty) {
      slotsToExport = slotsToExport.filter(slot => slot.facultyId === options.selectedFaculty);
    } else if (options.viewType === 'room' && options.selectedRoom) {
      slotsToExport = slotsToExport.filter(slot => slot.roomId === options.selectedRoom);
    }

    // Add data rows
    slotsToExport.forEach(slot => {
      const formattedSlot = this.formatSlotForDisplay(slot);
      csvContent += `"${formattedSlot.courseCode}","${formattedSlot.courseName}","${formattedSlot.facultyName}","${formattedSlot.roomName}","${formattedSlot.day}","${formattedSlot.startTime}","${formattedSlot.endTime}",${formattedSlot.duration},"${formattedSlot.type}",${formattedSlot.studentCount}\n`;
    });

    // Add statistics if requested
    if (options.includeStatistics) {
      csvContent += '\n\nStatistics\n';
      csvContent += 'Metric,Value\n';
      csvContent += `Total Slots,${this.timetable.statistics.totalSlots}\n`;
      csvContent += `Room Utilization,${this.timetable.statistics.roomUtilization}%\n`;
      csvContent += `Faculty Workload Balance,${this.timetable.statistics.facultyWorkloadBalance}%\n`;
      csvContent += `Conflict Count,${this.timetable.statistics.conflictCount}\n`;
      csvContent += `NEP Compliance,${this.timetable.statistics.nepCompliance}%\n`;
    }

    // Add conflicts if requested
    if (options.includeConflicts && this.timetable.conflicts.length > 0) {
      csvContent += '\n\nConflicts\n';
      csvContent += 'Type,Message,Severity\n';
      this.timetable.conflicts.forEach(conflict => {
        csvContent += `"${conflict.type}","${conflict.message}","${conflict.severity}"\n`;
      });
    }

    return csvContent;
  }

  public generateHTMLTable(options: ExportOptions): string {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

    let html = `
      <html>
        <head>
          <title>${this.timetable.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .timetable-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .timetable-table th, .timetable-table td { border: 1px solid #ddd; padding: 8px; text-align: center; }
            .timetable-table th { background-color: #f2f2f2; font-weight: bold; }
            .slot { background-color: #e3f2fd; padding: 4px; border-radius: 4px; margin: 2px; }
            .slot-course { font-weight: bold; font-size: 12px; }
            .slot-faculty { font-size: 10px; color: #666; }
            .slot-room { font-size: 10px; color: #666; }
            .statistics { margin-top: 30px; }
            .stat-item { margin: 5px 0; }
            .conflicts { margin-top: 30px; }
            .conflict-item { margin: 5px 0; padding: 10px; background-color: #ffebee; border-left: 4px solid #f44336; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${this.timetable.name}</h1>
            <p>Academic Year: ${this.timetable.academicYear} | Semester: ${this.timetable.semester}</p>
            <p>Generated on: ${new Date(this.timetable.createdAt).toLocaleDateString()}</p>
          </div>
    `;

    if (options.viewType === 'weekly') {
      html += '<table class="timetable-table"><thead><tr><th>Time</th>';
      
      days.forEach(day => {
        html += `<th>${day}</th>`;
      });
      
      html += '</tr></thead><tbody>';

      timeSlots.forEach(timeSlot => {
        html += `<tr><td><strong>${timeSlot}</strong></td>`;
        
        days.forEach(day => {
          const slotsAtTime = this.timetable.slots.filter(slot => 
            slot.day === day && slot.startTime === timeSlot
          );
          
          html += '<td>';
          slotsAtTime.forEach(slot => {
            const formattedSlot = this.formatSlotForDisplay(slot);
            html += `
              <div class="slot">
                <div class="slot-course">${formattedSlot.courseCode}</div>
                <div class="slot-faculty">${formattedSlot.facultyName}</div>
                <div class="slot-room">${formattedSlot.roomName}</div>
              </div>
            `;
          });
          html += '</td>';
        });
        
        html += '</tr>';
      });

      html += '</tbody></table>';
    }

    // Add statistics
    if (options.includeStatistics) {
      html += `
        <div class="statistics">
          <h2>Statistics</h2>
          <div class="stat-item"><strong>Total Slots:</strong> ${this.timetable.statistics.totalSlots}</div>
          <div class="stat-item"><strong>Room Utilization:</strong> ${this.timetable.statistics.roomUtilization}%</div>
          <div class="stat-item"><strong>Faculty Workload Balance:</strong> ${this.timetable.statistics.facultyWorkloadBalance}%</div>
          <div class="stat-item"><strong>Conflicts:</strong> ${this.timetable.statistics.conflictCount}</div>
          <div class="stat-item"><strong>NEP Compliance:</strong> ${this.timetable.statistics.nepCompliance}%</div>
        </div>
      `;
    }

    // Add conflicts
    if (options.includeConflicts && this.timetable.conflicts.length > 0) {
      html += '<div class="conflicts"><h2>Conflicts</h2>';
      this.timetable.conflicts.forEach(conflict => {
        html += `
          <div class="conflict-item">
            <strong>${conflict.type.replace('_', ' ').toUpperCase()}:</strong> ${conflict.message}
            <br><small>Severity: ${conflict.severity}</small>
          </div>
        `;
      });
      html += '</div>';
    }

    html += '</body></html>';
    return html;
  }

  public downloadFile(content: string, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}

export function exportTimetable(
  timetable: GeneratedTimetable,
  faculty: Faculty[],
  courses: Course[],
  rooms: Room[],
  options: ExportOptions
): void {
  const exporter = new TimetableExporter(timetable, faculty, courses, rooms);
  
  const timestamp = new Date().toISOString().split('T')[0];
  
  switch (options.format) {
    case 'csv':
      const csvContent = exporter.generateCSV(options);
      exporter.downloadFile(csvContent, `timetable_${timestamp}.csv`, 'text/csv');
      break;
      
    case 'pdf':
      // For PDF, we'll generate HTML and open in a new window for printing
      const htmlContent = exporter.generateHTMLTable(options);
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(htmlContent);
        newWindow.document.close();
        newWindow.focus();
        // Auto-print
        setTimeout(() => {
          newWindow.print();
        }, 1000);
      }
      break;
      
    case 'excel':
      // For Excel, we'll use CSV format with .xls extension
      const excelContent = exporter.generateCSV(options);
      exporter.downloadFile(excelContent, `timetable_${timestamp}.xls`, 'application/vnd.ms-excel');
      break;
      
    default:
      console.error('Unsupported export format');
  }
}

export function generateShareLink(timetableId: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/shared-timetable/${timetableId}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}