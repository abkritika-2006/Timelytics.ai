import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  Download, 
  FileText, 
  Share2, 
  Calendar, 
  Mail,
  Link,
  CheckCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  timetableData?: any;
}

export function ExportModal({ isOpen, onClose, timetableData }: ExportModalProps) {
  const [exportFormat, setExportFormat] = useState<'pdf' | 'excel' | 'calendar'>('pdf');
  const [shareEmail, setShareEmail] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [exported, setExported] = useState(false);

  if (!isOpen) return null;

  const handleExport = async (format: 'pdf' | 'excel' | 'calendar') => {
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1500));
    setExported(true);
    
    // Generate download link based on format
    const filename = `timetable-${Date.now()}.${format === 'excel' ? 'xlsx' : format === 'calendar' ? 'ics' : 'pdf'}`;
    
    // In a real app, this would trigger actual file download
    console.log(`Exporting ${filename}`);
    
    setTimeout(() => setExported(false), 3000);
  };

  const handleShareEmail = async () => {
    if (!shareEmail) return;
    // Simulate email sharing
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert(`Timetable shared with ${shareEmail}`);
    setShareEmail('');
  };

  const generateShareLink = () => {
    const link = `https://timelytics.ai/shared/timetable/${Math.random().toString(36).substr(2, 9)}`;
    setShareLink(link);
    navigator.clipboard.writeText(link);
  };

  const exportOptions = [
    {
      id: 'pdf',
      title: 'PDF Document',
      description: 'High-quality printable format',
      icon: FileText,
      color: 'red'
    },
    {
      id: 'excel',
      title: 'Excel Spreadsheet',
      description: 'Editable data format',
      icon: Download,
      color: 'green'
    },
    {
      id: 'calendar',
      title: 'Calendar File',
      description: 'Import to Google/Outlook Calendar',
      icon: Calendar,
      color: 'blue'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl">Export & Share Timetable</h2>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <Tabs defaultValue="export" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="export">Export Files</TabsTrigger>
              <TabsTrigger value="share">Share & Collaborate</TabsTrigger>
            </TabsList>

            <TabsContent value="export" className="space-y-6">
              <div>
                <h3 className="text-lg mb-4">Choose Export Format</h3>
                <div className="grid gap-4">
                  {exportOptions.map((option) => (
                    <motion.div
                      key={option.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`cursor-pointer transition-all border-2 ${
                          exportFormat === option.id 
                            ? `border-${option.color}-500 bg-${option.color}-50 dark:bg-${option.color}-900/20`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setExportFormat(option.id as any)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-lg bg-${option.color}-100 dark:bg-${option.color}-900 flex items-center justify-center`}>
                              <option.icon className={`h-6 w-6 text-${option.color}-600`} />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg">{option.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">{option.description}</p>
                            </div>
                            {exportFormat === option.id && (
                              <CheckCircle className={`h-5 w-5 text-${option.color}-600`} />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Ready to export in {exportOptions.find(o => o.id === exportFormat)?.title}
                </div>
                <Button 
                  onClick={() => handleExport(exportFormat)}
                  disabled={exported}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                >
                  {exported ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Exported!
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Now
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="share" className="space-y-6">
              {/* Email Share */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2" />
                    Share via Email
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="colleague@university.edu"
                      value={shareEmail}
                      onChange={(e) => setShareEmail(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleShareEmail} disabled={!shareEmail}>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Timetable
                  </Button>
                </CardContent>
              </Card>

              {/* Link Share */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Link className="h-5 w-5 mr-2" />
                    Share Link
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Generate a secure link to share the timetable with others
                  </p>
                  
                  {shareLink ? (
                    <div className="space-y-2">
                      <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm break-all">{shareLink}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => navigator.clipboard.writeText(shareLink)}
                        >
                          Copy Link
                        </Button>
                        <Button variant="outline" onClick={() => setShareLink('')}>
                          Generate New
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={generateShareLink}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Generate Share Link
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Quick Share Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Share</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Add to Google Calendar
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Calendar className="h-4 w-4 mr-2" />
                      Add to Outlook
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share on WhatsApp
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share on Teams
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}