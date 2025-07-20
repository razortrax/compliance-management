"use client";

import { useState } from 'react';
import AccidentForm, { AccidentFormData } from '../../../components/AccidentForm';
import RoadsideInspectionForm, { RoadsideInspectionFormData } from '../../../components/RoadsideInspectionForm';
import Button from '../../../ui/Button';
import { Card } from '../../../ui/Card';

export default function FormsDemoPage() {
  const [showAccidentForm, setShowAccidentForm] = useState(false);
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);

  const handleAccidentSubmit = async (data: AccidentFormData) => {
    console.log('Accident form submitted:', data);
    setSubmittedData({ type: 'accident', data });
    setShowAccidentForm(false);
  };

  const handleInspectionSubmit = async (data: RoadsideInspectionFormData) => {
    console.log('Roadside inspection form submitted:', data);
    setSubmittedData({ type: 'inspection', data });
    setShowInspectionForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Violation Forms Demo</h1>
          <p className="text-gray-600">
            This demo showcases the AccidentForm and RoadsideInspectionForm components 
            with integrated ViolationSelector functionality.
          </p>
        </div>

        {/* Form Selection */}
        {!showAccidentForm && !showInspectionForm && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Accident Report Form</h2>
              <p className="text-gray-600 mb-4">
                Complete accident reporting with violation selection, officer information, 
                and detailed incident description.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setShowAccidentForm(true)}
                  className="w-full"
                >
                  Create Accident Report (Driver)
                </Button>
                <Button
                  onClick={() => setShowAccidentForm(true)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Create Accident Report (Equipment)
                </Button>
                <Button
                  onClick={() => setShowAccidentForm(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Create Accident Report (Company)
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Roadside Inspection Form</h2>
              <p className="text-gray-600 mb-4">
                Comprehensive roadside inspection reporting with violation selection, 
                out-of-service tracking, and inspection level details.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={() => setShowInspectionForm(true)}
                  className="w-full"
                >
                  Create Inspection Report (Driver)
                </Button>
                <Button
                  onClick={() => setShowInspectionForm(true)}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Create Inspection Report (Equipment)
                </Button>
                <Button
                  onClick={() => setShowInspectionForm(true)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Create Inspection Report (Company)
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Accident Form */}
        {showAccidentForm && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Accident Report Form</h2>
              <Button
                onClick={() => setShowAccidentForm(false)}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Back to Forms
              </Button>
            </div>
            <AccidentForm
              onSubmit={handleAccidentSubmit}
              onCancel={() => setShowAccidentForm(false)}
              entityType="driver"
              entityName="John Smith"
              violations={[]}
            />
          </div>
        )}

        {/* Roadside Inspection Form */}
        {showInspectionForm && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Roadside Inspection Form</h2>
              <Button
                onClick={() => setShowInspectionForm(false)}
                className="bg-gray-600 hover:bg-gray-700"
              >
                Back to Forms
              </Button>
            </div>
            <RoadsideInspectionForm
              onSubmit={handleInspectionSubmit}
              onCancel={() => setShowInspectionForm(false)}
              entityType="equipment"
              entityName="Unit 1001 (2022 Freightliner)"
              violations={[]}
            />
          </div>
        )}

        {/* Submitted Data Display */}
        {submittedData && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {submittedData.type === 'accident' ? 'Accident Report' : 'Roadside Inspection Report'} Submitted
            </h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(submittedData.data, null, 2)}
              </pre>
            </div>
            <div className="mt-4">
              <Button
                onClick={() => setSubmittedData(null)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Clear Data
              </Button>
            </div>
          </Card>
        )}

        {/* Features Overview */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Form Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-2">ViolationSelector Integration</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Search and filter violations</li>
                <li>• Type-based filtering (Vehicle/Driver/Other)</li>
                <li>• OOS percentage display</li>
                <li>• Multi-select functionality</li>
              </ul>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Comprehensive Data Capture</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Date/time tracking</li>
                <li>• Location information</li>
                <li>• Officer details</li>
                <li>• Weather/road conditions</li>
                <li>• Out-of-service tracking</li>
              </ul>
            </Card>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Entity Context</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Driver-specific forms</li>
                <li>• Equipment-specific forms</li>
                <li>• Company-wide forms</li>
                <li>• Contextual validation</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 