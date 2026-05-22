import React from "react";
import TicketCita from "./TicketCita";
import { useCitaForm } from "./hooks/useCitaForm";
import StepIndicator from "./components/StepIndicator";
import PatientSearch from "./components/PatientSearch";
import CitaDetails from "./components/CitaDetails";
import SidePanel from "./components/SidePanel";
import { IoAlertCircleOutline } from "react-icons/io5";

const GenerarCitaFlujo: React.FC<{ onBackToDashboard: () => void }> = ({ onBackToDashboard: _onBack }) => {
  const form = useCitaForm();

  if (form.generatedTicket) {
    return <TicketCita ticket={form.generatedTicket} onClose={form.handleReset} />;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

      <div className="lg:col-span-2 space-y-5">
        <StepIndicator step={form.step} />

        <div className="bg-white border border-slate-100 rounded-2xl p-6 md:p-8 space-y-6">

          {form.errors.global && (
            <div className="flex items-start gap-3 p-4 bg-[#CA0000]/5 border border-[#CA0000]/20 rounded-xl text-sm text-[#CA0000] font-medium">
              <IoAlertCircleOutline className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{form.errors.global}</span>
            </div>
          )}

          {form.step === 1 && (
            <PatientSearch
              dniQuery={form.dniQuery}
              setDniQuery={form.setDniQuery}
              patient={form.patient}
              patientNotFound={form.patientNotFound}
              newPatientName={form.newPatientName}
              setNewPatientName={form.setNewPatientName}
              newPatientLastName={form.newPatientLastName}
              setNewPatientLastName={form.setNewPatientLastName}
              newPatientBirthDate={form.newPatientBirthDate}
              setNewPatientBirthDate={form.setNewPatientBirthDate}
              newPatientGenero={form.newPatientGenero}
              setNewPatientGenero={form.setNewPatientGenero}
              errors={form.errors}
              setErrors={form.setErrors}
              isSearching={form.isSearching}
              isRegistering={form.isRegistering}
              onSearch={form.handleSearchPatient}
              onRegister={form.handleRegisterNewPatient}
              onContinue={form.handleContinueToCita}
            />
          )}

          {form.step === 2 && form.patient && (
            <CitaDetails
              patient={form.patient}
              especialidades={form.especialidades}
              especialidadId={form.especialidadId}
              setEspecialidadId={form.setEspecialidadId}
              medicos={form.medicos}
              medicoId={form.medicoId}
              setMedicoId={form.setMedicoId}
              fecha={form.fecha}
              setFecha={form.setFecha}
              turno={form.turno}
              setTurno={form.setTurno}
              errors={form.errors}
              setErrors={form.setErrors}
              isSaving={form.isSaving}
              isLoadingData={form.isLoadingData}
              isCitaFormInvalid={form.isCitaFormInvalid}
              getTodayString={form.getTodayString}
              onBack={() => form.setStep(1)}
              onSubmit={form.handleSaveCita}
            />
          )}

        </div>
      </div>

      <SidePanel step={form.step} />

    </div>
  );
};

export default GenerarCitaFlujo;
