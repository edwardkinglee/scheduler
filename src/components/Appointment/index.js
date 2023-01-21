import React from "react";
import "components/Appointment/styles.scss"
import Header from "./Header";
import Empty from "./Empty";
import Show from "./Show";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Confirm from "./Confirm";
import Status from "./Status";
import Error from "./Error"

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  function save(name, interviewer) {
    const id = props.id
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(id, interview)
    .then(() => {
      transition(SHOW)})
    .catch(() => transition(ERROR_SAVE, true))
      
  }

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
 
  const cancel = () => {
    transition(DELETING, true);
    
    props.cancelInterview(props.id, props.interview)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true))
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />

      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
     <Show
      student={props.interview.student}
      interviewer={props.interview.interviewer}
      onDelete={() => transition(CONFIRM)}
      onEdit={() => transition(EDIT)}
     />
)}    
      {mode === CREATE && (
        <Form 
          onCancel = {() => back()}
          interviewers = {props.interviewers}
          onSave = {save}
        />
      )}

      {mode === CONFIRM && (
        <Confirm 
          message={'Are you sure?'}
          onCancel={back}
          onConfirm={cancel}
        />
      )}

      {mode === DELETING && (
        <Status
          message={'Deleting'}
        />
      )}

      {mode === EDIT && (
        <Form
        student={props.interview.student}
        interviewer={props.interview.interviewer.id}
        interviewers={props.interviewers}
        onSave={save}
        onCancel={back}
        />
      )}

      {mode === ERROR_DELETE && (
        <Error 
        message={'Could not cancel appointment.'}
        onClose={back}
        />
      )}

      {mode === ERROR_SAVE && (
        <Error 
        message={'Could not save appointment.'}
        onClose={back}
        />
      )}
       
    </article>
  );
}