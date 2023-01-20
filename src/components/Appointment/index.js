import React from "react";
import "components/Appointment/styles.scss"
import Header from "./Header";
import Empty from "./Empty";
import Show from "./Show";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Confirm from "./Confirm";
import Status from "./Status";

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";

  function save(name, interviewer) {
    const id = props.id
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(id, interview)
    .then(() => transition(SHOW))
      
  }

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
 
  const cancel = () => {
    transition(DELETING);
    
    props.cancelInterview(props.id, props.interview)
      .then(() => transition(EMPTY))
  }

  return (
    <article className="appointment">
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
       
    </article>
  );
}