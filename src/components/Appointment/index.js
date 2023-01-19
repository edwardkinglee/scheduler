import React from "react";
import "components/Appointment/styles.scss"
import Header from "./Header";
import Empty from "./Empty";
import Show from "./Show";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";

  function save(name, interviewer) {
    const id = props.id
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(id, interview)
      transition(SHOW);
  }

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );
  console.log('interviewers',props.interviewers);
  return (
    <article className="appointment">
      <Header time={props.time} />

      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
     <Show
      student={props.interview.student}
      interviewer={props.interview.interviewer}
     />
)}    
      {mode === CREATE && (
        <Form 
          onCancel = {() => back()}
          interviewers = {props.interviewers}
          onSave = {save}
        />
      )}
       
    </article>
  );
}