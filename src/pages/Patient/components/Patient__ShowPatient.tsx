import React, { useState, useEffect } from 'react';
import { PatientInfo, Consultation, Patient__Types, Routes, Api, Notification, SkeletonLoading } from '../../shared';

const statusLabel = (status: Patient__Types.covidStatus) => {
  switch (status) {
    case Patient__Types.covidStatus.POSITIVE:
      return "w-max-content text-xs bg-red-100 border border-red-300 flex-shrink leading-normal text-red-600 font-semibold px-3 py-px rounded mx-auto";
    case Patient__Types.covidStatus.SUSPECTED:
      return "w-max-content text-xs bg-yellow-100 border border-yellow-300 flex-shrink leading-normal text-yellow-400 font-semibold px-3 py-px rounded mx-auto";
    default:
      return "w-max-content text-xs bg-yellow-100 border border-yellow-300 flex-shrink leading-normal text-yellow-400 font-semibold px-3 py-px rounded mx-auto";
  }
};

const handleErrorCB = () => console.log("Error");

const handleSucessCB = (send: React.Dispatch<React.SetStateAction<any>>, response: any) => {
  const patients = response.last_consultation;
  send(() => patients);
};

const getPatientDetails = (id: string, send: React.Dispatch<React.SetStateAction<any>>, token: string) => {
  send(() => 'Loading');
  Api.getWithToken(
    Routes.url(`otp/patient/${id}/`),
    token,
    (response: any) => handleSucessCB(send, response),
    handleErrorCB
  );
};

const symptomToString = (symptom: number) => {
  switch (symptom) {
    case 1: return "ASYMPTOMATIC";
    case 2: return "FEVER";
    case 3: return "SORE THROAT";
    case 4: return "COUGH";
    case 5: return "BREATHLESSNESS";
    case 6: return "MYALGIA";
    case 7: return "ABDOMINAL DISCOMFORT";
    case 8: return "VOMITING/DIARRHOEA";
    case 10: return "SARI";
    case 11: return "SPUTUM";
    case 12: return "NAUSEA";
    case 13: return "CHEST PAIN";
    case 14: return "HEMOPTYSIS";
    case 15: return "NASAL DISCHARGE";
    case 16: return "BODY ACHE";
    default: return "OTHERS";
  }
};

const showConsultationCard = (consultation: Consultation.t) => (
  <div className="rounded-lg px-4 pt-2 mt-4">
    <div className="grid grid-cols-2 gap-x-3 text-sm">
      <div className="bg-white p-4">
        {consultation.admitted ? (
          <div className="flex">
            <div>
              <div className="rounded-full bg-red-100 p-2 text-center">
                <i className="text-red-400 fas fa-bed" />
              </div>
            </div>
            <div className="m-auto font-bold ml-3">ADMITTED</div>
          </div>
        ) : (
          <div className="flex">
            <div>
              <div className="rounded-full bg-green-100 text-center p-2">
                <i className="text-green-400 text-lg fas fa-bed" />
              </div>
            </div>
            <div className="m-auto ml-3">
              <text className="font-bold">NOT </text>Admitted
            </div>
          </div>
        )}
      </div>
      <div className="flex bg-white p-4 text-center">
        <div className="my-auto">
          <div className="rounded-full bg-blue-100 p-2 pl-3 pr-3 text-center">
            <i className="text-blue-600 text-lg fas fa-atom"></i>
          </div>
        </div>
        <div className="m-auto ml-2">Oxygen Saturation</div>
      </div>
    </div>

    {consultation.category && (
      <div className="flex bg-white p-4 text-center mt-4">
        <div className="my-auto">
          <div className="rounded-full bg-indigo-100 text-center p-2 pl-3 pr-3 text-center">
            <i className="text-indigo-600 text-lg fas fa-th-large" />
          </div>
        </div>
        <div className="p-4 flex justify-around">
          <div className="leading-5 font-semibold text-gray-500 mr-3">Category:</div>
          <div className="font-semibold text-sm leading-5 text-gray-900">{consultation.category}</div>
        </div>
      </div>
    )}

    {consultation.consultation_notes && (
      <div className="flex bg-white p-4 mt-4">
        <div className="my-auto">
          <div className="rounded-full bg-red-100 text-center p-2 pl-3 pr-3 text-center">
            <i className="text-red-600 text-lg fas fa-stethoscope" />
          </div>
        </div>
        <div className="p-4 lg:flex">
          <div className="leading-5 font-semibold text-gray-500 mr-3">Consultation Notes:</div>
          <div className="font-semibold text-sm leading-5 text-gray-900 sm:mt-2 lg:mt-0">{consultation.consultation_notes}</div>
        </div>
      </div>
    )}

    {consultation.examination_details && (
      <div className="flex bg-white p-4 mt-4">
        <div className="my-auto">
          <div className="rounded-full bg-purple-100 text-center p-2 pl-3 pr-3 text-center">
            <i className="text-purple-600 text-lg fas fa-notes-medical" />
          </div>
        </div>
        <div className="p-4 lg:flex">
          <div className="leading-5 font-semibold text-gray-500 mr-3">Examination Details:</div>
          <div className="font-semibold text-sm leading-5 text-gray-900 sm:mt-2 lg:mt-0">{consultation.examination_details}</div>
        </div>
      </div>
    )}

    <div className="bg-white mt-4 p-4 pb-0">
      <div className="flex bg-white p-4 pl-0 mt-4">
        <div className="my-auto">
          <div className="rounded-full bg-pink-100 text-center p-2 pl-3 pr-3 text-center">
            <i className="text-pink-600 text-lg fas fa-user" />
          </div>
        </div>
        <div className="ml-3 font-bold text-lg my-3">Patient Details</div>
      </div>

      <div className="grid grid-cols-1 text-sm mt-2">
        {consultation.admission_date && (
          <div className="grid grid-cols-2 gap-x-2 pt-3 border-b-2 border-gray-200">
            <div>Admission Date</div>
            <div className="max-w-2xl text-sm leading-5 text-gray-500">admission date: {new Date(consultation.admission_date).toDateString()}</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-2 mt-3 mb-2 pt-3 pb-2 border-b-2 border-gray-200">
          <div className="text-sm leading-5 font-medium text-gray-500">Facility Name:</div>
          <div className="text-sm leading-5 text-gray-900">{consultation.facility_name}</div>
        </div>

        {consultation.discharge_date && (
          <div className="grid grid-cols-2 gap-x-2 mt-3 mb-2 pt-3 pb-2 border-b-2 border-gray-200">
            <div className="sm:grid sm:mt-5 sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">Discharge Date</div>
            <div className="text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">{new Date(consultation.discharge_date).toDateString()}</div>
          </div>
        )}

        {consultation.bed_number && (
          <div className="grid grid-cols-2 gap-x-2 mt-3 mb-2 pt-3 pb-2 border-b-2 border-gray-200">
            <div className="text-sm leading-5 font-medium text-gray-500">Bed Number</div>
            <div className="text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2">{consultation.bed_number}</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-x-2 mt-3 mb-2 pt-3 pb-2 border-b-2 border-gray-200">
          <div className="text-sm leading-5 font-medium text-gray-500">Symptoms</div>
          <div className="text-sm leading-5 text-gray-900">
            <div className="sm:mt-0 sm:col-span-2 space-y-2 space-x-2">
              {consultation.symptoms.map((symptom: number) => (
                <span key={symptom} className="px-2 bg-orange-100 rounded text-xs py-1">{symptomToString(symptom)}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const showCovidStatus = (patient: PatientInfo.t) => (
  <div key={patient.id} className="rounded-lg px-4 py-2 mt-4">
    <div className="bg-white p-4 flex border-gray-200">
      <div className="text-sm leading-5 font-medium text-gray-500 mr-4">Covid-19 Status</div>
      <div className="text-center">
        <div className={statusLabel(Patient__Types.getStatusType(patient.diseaseStatus))}>{patient.diseaseStatus}</div>
      </div>
    </div>
  </div>
);

const showPatientCard = (patient: PatientInfo.t, _send: React.Dispatch<React.SetStateAction<any>>) => (
  <div className="bg-gray-100 p-4 pt-0">
    <div className="bg-white grid grid-cols-1 text-sm p-4 pt-0">
      <div className="grid grid-cols-2 gap-x-2 mt-3 mb-2 pt-3 pb-2 border-b-2 border-gray-200">
        <div className="text-sm leading-5 font-medium text-gray-500">Date of Birth</div>
        <div className="text-sm leading-5 text-gray-900">{patient.dateOfBirth}</div>
      </div>

      <div className="grid grid-cols-2 gap-x-2 mt-3 mb-2 pt-3 pb-2 border-b-2 border-gray-200">
        <div className="text-sm leading-5 font-medium text-gray-500">Mobile Number</div>
        <div className="text-sm leading-5 text-gray-900">{patient.phoneNumber}</div>
      </div>

      <div className="grid grid-cols-2 gap-x-2 mt-3 mb-2 pt-3 pb-2 border-b-2 border-gray-200">
        <div className="text-sm leading-5 font-medium text-gray-500">Blood Group</div>
        <div className="text-sm leading-5 text-gray-900">{patient.bloodGroup || '-'}</div>
      </div>

      <div className="grid grid-cols-2 gap-x-2 mt-3 mb-2 pt-3 pb-2 border-b-2 border-gray-200">
        <div className="text-sm leading-5 font-medium text-gray-500">Emergency Contact number</div>
        <div className="text-sm leading-5 text-gray-900">{patient.emergencyPhoneNumber}</div>
      </div>

      <div className="grid grid-cols-2 gap-x-2 mt-3 mb-2 pt-3 pb-2 border-b-2 border-gray-200">
        <div className="text-sm leading-5 font-medium text-gray-500">Address</div>
        <div className="text-sm leading-5 text-gray-900">
          <div className="mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2 whitespace-pre-wrap">
            {patient.address}
            {patient.pincode && <div>Pincode: {patient.pincode}</div>}
            {patient.districtObject && <div>District: {patient.districtObject.name}</div>}
            {patient.localBodyObject && <div>District: {patient.localBodyObject.name}</div>}
            {patient.wardObject && <div>District: {patient.wardObject.name}</div>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-2 mt-3 mb-2 pt-3 pb-2 border-b-2 border-gray-200">
        <div className="text-sm leading-5 font-medium text-gray-500">Gender</div>
        <div className="text-sm leading-5 text-gray-900">
          {patient.gender === 1 ? 'Male' : patient.gender === 2 ? 'Female' : ''}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-2 mt-3 mb-2 pt-3 pb-2 border-b-2 border-gray-200">
        <div className="text-sm leading-5 font-medium text-gray-500">Number Of Aged Dependents</div>
        <div className="text-sm leading-5 text-gray-900">{patient.numberOfAgedDependents}</div>
      </div>

      <div className="grid grid-cols-2 gap-x-2 mt-3 mb-2 pt-3 pb-2 border-b-2 border-gray-200">
        <div className="text-sm leading-5 font-medium text-gray-500">Number Of Chronic Diseased Dependents</div>
        <div className="text-sm leading-5 text-gray-900">{patient.numberOfChronicDiseasedDependents}</div>
      </div>

      {patient.facilityObject && (
        <div className="grid grid-cols-2 gap-x-2 mt-3 mb-2 pt-3 pb-2 border-b-2 border-gray-200">
          <div className="text-sm leading-5 font-medium text-gray-500">Last visited facility</div>
          <div className="text-sm leading-5 text-gray-900">{patient.facilityObject.name}</div>
        </div>
      )}

      {patient.willDonateBlood !== undefined && (
        <div className="grid grid-cols-2 gap-x-2 mt-3 mb-2 pt-3 pb-2 border-b-2 border-gray-200">
          <div className="text-sm leading-5 font-medium text-gray-500">Willing to Donate Blood</div>
          <div className="text-sm leading-5 text-gray-900">{patient.willDonateBlood ? 'Yes' : 'No'}</div>
        </div>
      )}

      {patient.isDeclaredPositive !== undefined && (
        <div className="grid grid-cols-2 gap-x-2 mt-3 mb-2 pt-3 pb-2 border-b-2 border-gray-200">
          <div className="text-sm leading-5 font-medium text-gray-500">Has been declared positive</div>
          <div className="text-sm leading-5 text-gray-900">{patient.isDeclaredPositive ? 'Yes' : 'No'}</div>
        </div>
      )}
    </div>
  </div>
);

const PatientShowPatient = ({ patientInfo, token }: { patientInfo: PatientInfo.t, token: string }) => {
  const [state, setState] = useState<any>('Loading');

  useEffect(() => {
    getPatientDetails(patientInfo.id, setState, token);
  }, [token]);

  return (
    <div className="max-w-3xl mx-auto h-full">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-2">
        <div className="flex">
          <div className="flex-shrink-0"><i className="text-yellow-700 fas fa-check" /></div>
          <div className="ml-3">
            <p className="text-sm leading-5 text-yellow-700">
              Share your medical records with the hospital by sharing your phone number and date of birth.
            </p>
          </div>
        </div>
      </div>
      <h1 className="pt-6 text-gray-700 font-semibold text-3xl">{patientInfo.name}</h1>
      <div className="font-mono text-xs">Unique Id: {patientInfo.id}</div>
      <div className="bg-gray-100">
        {showCovidStatus(patientInfo)}
        {state === 'Loading' ? (
          SkeletonLoading.multiple({ count: 3, element: SkeletonLoading.card() })
        ) : (
          <div>{showConsultationCard(state)}</div>
        )}
        {showPatientCard(patientInfo, setState)}
      </div>
    </div>
  );
};

export default PatientShowPatient;
