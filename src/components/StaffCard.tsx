"use client";
import { useState } from "react";
import { X, Mail, Phone, User, Calendar, Edit, Save, X as Cancel, Plus, MessageSquare, Clock } from "lucide-react";

interface Email {
  id: string;
  emailAddress: string;
  emailType: 'PERSONAL' | 'WORK' | 'NOTIFICATION' | 'BILLING';
  isPrimary: boolean;
  isVerified: boolean;
  notes?: string;
}

interface Phone {
  id: string;
  phoneNumber: string;
  phoneType: 'PERSONAL' | 'WORK' | 'MOBILE' | 'FAX' | 'EMERGENCY';
  isPrimary: boolean;
  notes?: string;
}

interface CommunicationLog {
  id: string;
  type: 'CALL' | 'EMAIL' | 'NOTE';
  contactMethod: string;
  timestamp: string;
  subject?: string;
  notes: string;
}

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  hireDate: string;
  emails: Email[];
  phones: Phone[];
  communicationLogs: CommunicationLog[];
}

interface StaffCardProps {
  staff: StaffMember;
  isOpen: boolean;
  onClose: () => void;
}

export default function StaffCard({ staff, isOpen, onClose }: StaffCardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'communications'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedStaff, setEditedStaff] = useState<StaffMember>(staff);

  if (!isOpen) return null;

  const primaryEmail = editedStaff.emails.find(email => email.isPrimary);
  const primaryPhone = editedStaff.phones.find(phone => phone.isPrimary);

  const handleSave = () => {
    // TODO: Implement save logic - for now just close edit mode
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedStaff(staff);
    setIsEditing(false);
  };

  const updateStaffField = (field: keyof StaffMember, value: any) => {
    setEditedStaff(prev => ({ ...prev, [field]: value }));
  };

  const updateEmail = (emailId: string, field: keyof Email, value: any) => {
    setEditedStaff(prev => ({
      ...prev,
      emails: prev.emails.map(email => 
        email.id === emailId ? { ...email, [field]: value } : email
      )
    }));
  };

  const updatePhone = (phoneId: string, field: keyof Phone, value: any) => {
    setEditedStaff(prev => ({
      ...prev,
      phones: prev.phones.map(phone => 
        phone.id === phoneId ? { ...phone, [field]: value } : phone
      )
    }));
  };

  const getEmailIcon = (type: string) => {
    switch (type) {
      case 'WORK': return '💼';
      case 'PERSONAL': return '👤';
      case 'NOTIFICATION': return '🔔';
      case 'BILLING': return '💰';
      default: return '📧';
    }
  };

  const getPhoneIcon = (type: string) => {
    switch (type) {
      case 'WORK': return '🏢';
      case 'MOBILE': return '📱';
      case 'PERSONAL': return '🏠';
      case 'FAX': return '📠';
      case 'EMERGENCY': return '🚨';
      default: return '📞';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between min-h-[72px]">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <User className="w-6 h-6 text-blue-600 flex-shrink-0" />
            {isEditing ? (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <input
                  type="text"
                  value={editedStaff.firstName}
                  onChange={(e) => updateStaffField('firstName', e.target.value)}
                  className="text-xl font-semibold text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[80px] flex-1"
                  placeholder="First"
                />
                <input
                  type="text"
                  value={editedStaff.lastName}
                  onChange={(e) => updateStaffField('lastName', e.target.value)}
                  className="text-xl font-semibold text-gray-900 bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[80px] flex-1"
                  placeholder="Last"
                />
              </div>
            ) : (
              <h2 className="text-xl font-semibold text-gray-900 truncate">
                {editedStaff.firstName} {editedStaff.lastName}
              </h2>
            )}
            {isEditing ? (
              <select
                value={editedStaff.status}
                onChange={(e) => updateStaffField('status', e.target.value)}
                className="px-2 py-1 rounded text-xs border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-shrink-0"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="TERMINATED">TERMINATED</option>
              </select>
            ) : (
              <span className={`px-2 py-1 rounded text-xs flex-shrink-0 ${
                editedStaff.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {editedStaff.status}
              </span>
            )}
          </div>
          {!isEditing && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-4"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('communications')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'communications'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Communication Logs
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hire Date</label>
                      {isEditing ? (
                        <input
                          type="date"
                          value={editedStaff.hireDate}
                          onChange={(e) => updateStaffField('hireDate', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      ) : (
                        <div className="flex items-center mt-1">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {new Date(editedStaff.hireDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      {isEditing ? (
                        <select
                          value={editedStaff.status}
                          onChange={(e) => updateStaffField('status', e.target.value)}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="INACTIVE">INACTIVE</option>
                          <option value="TERMINATED">TERMINATED</option>
                        </select>
                      ) : (
                        <span className={`inline-block mt-1 px-2 py-1 rounded text-xs ${
                          editedStaff.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {editedStaff.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Management */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                    {isEditing && (
                      <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4" />
                        Add Contact
                      </button>
                    )}
                  </div>
                  
                  {/* Emails Section */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Mail className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Email Addresses ({editedStaff.emails.length})</span>
                    </div>
                    <div className="space-y-3">
                      {editedStaff.emails.map((email) => (
                        <div key={email.id} className="p-3 border border-gray-200 rounded bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1">
                              <span>{getEmailIcon(email.emailType)}</span>
                              {isEditing ? (
                                <input
                                  type="email"
                                  value={email.emailAddress}
                                  onChange={(e) => updateEmail(email.id, 'emailAddress', e.target.value)}
                                  className="text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                                />
                              ) : (
                                <span className="text-sm font-medium text-gray-900">{email.emailAddress}</span>
                              )}
                              {isEditing ? (
                                <select
                                  value={email.emailType}
                                  onChange={(e) => updateEmail(email.id, 'emailType', e.target.value)}
                                  className="text-xs text-gray-500 bg-white border border-gray-300 rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="PERSONAL">Personal</option>
                                  <option value="WORK">Work</option>
                                  <option value="NOTIFICATION">Notification</option>
                                  <option value="BILLING">Billing</option>
                                </select>
                              ) : (
                                <span className="text-xs text-gray-500 capitalize">({email.emailType.toLowerCase()})</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {email.isPrimary && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Primary</span>}
                              {email.isVerified && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified</span>}
                              {isEditing && (
                                <button className="text-gray-400 hover:text-gray-600">
                                  <Edit className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Phones Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Phone className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Phone Numbers ({editedStaff.phones.length})</span>
                    </div>
                    <div className="space-y-3">
                      {editedStaff.phones.map((phone) => (
                        <div key={phone.id} className="p-3 border border-gray-200 rounded bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 flex-1">
                              <span>{getPhoneIcon(phone.phoneType)}</span>
                              {isEditing ? (
                                <input
                                  type="tel"
                                  value={phone.phoneNumber}
                                  onChange={(e) => updatePhone(phone.id, 'phoneNumber', e.target.value)}
                                  className="text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                                />
                              ) : (
                                <span className="text-sm font-medium text-gray-900">{phone.phoneNumber}</span>
                              )}
                              {isEditing ? (
                                <select
                                  value={phone.phoneType}
                                  onChange={(e) => updatePhone(phone.id, 'phoneType', e.target.value)}
                                  className="text-xs text-gray-500 bg-white border border-gray-300 rounded px-1 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="PERSONAL">Personal</option>
                                  <option value="WORK">Work</option>
                                  <option value="MOBILE">Mobile</option>
                                  <option value="FAX">Fax</option>
                                  <option value="EMERGENCY">Emergency</option>
                                </select>
                              ) : (
                                <span className="text-xs text-gray-500 capitalize">({phone.phoneType.toLowerCase()})</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {phone.isPrimary && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Primary</span>}
                              {isEditing && (
                                <button className="text-gray-400 hover:text-gray-600">
                                  <Edit className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'communications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Communication Logs</h3>
                  <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Log
                  </button>
                </div>
                
                <div className="space-y-3">
                  {editedStaff.communicationLogs.map((log) => (
                    <div key={log.id} className="p-3 border border-gray-200 rounded">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {log.type === 'CALL' && <Phone className="w-4 h-4 text-blue-600" />}
                            {log.type === 'EMAIL' && <Mail className="w-4 h-4 text-green-600" />}
                            {log.type === 'NOTE' && <MessageSquare className="w-4 h-4 text-gray-600" />}
                            <span className="text-sm font-medium text-gray-900 capitalize">{log.type}</span>
                            <span className="text-xs text-gray-500">via {log.contactMethod}</span>
                            <span className="text-xs text-gray-400">
                              <Clock className="w-3 h-3 inline mr-1" />
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          {log.subject && (
                            <div className="text-sm text-gray-700 mb-1">{log.subject}</div>
                          )}
                          <div className="text-sm text-gray-600">{log.notes}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {editedStaff.communicationLogs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No communication logs yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Footer - Always Visible */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {primaryPhone && (
                <button className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors">
                  <Phone className="w-4 h-4" />
                  Call
                </button>
              )}
              {primaryEmail && (
                <button className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors">
                  <Mail className="w-4 h-4" />
                  Email
                </button>
              )}
            </div>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Edit Mode Footer */}
        {isEditing && (
          <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-end gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Cancel className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 