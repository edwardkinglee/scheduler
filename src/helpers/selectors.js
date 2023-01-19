
export function getAppointmentsForDay(state, day) {
  
  const appDay = [];

  for(const date of state.days) {
    if(date.name === day){
      for (const elem of date.appointments){
        appDay.push(state.appointments[elem]);
      }
    }
  }
  return appDay;
}

export function getInterview(state, interview) {
  if(!interview){
    return null;
  }

  const interviewerId = interview.interviewer;

  const output = {
    student: interview.student,
    interviewer: state.interviewers[interviewerId]
  };
  
  return output;
}

export function getInterviewersForDay(state, day) {
const { days, interviewers } = state;
const interviewersForDay = [];

const targetInterviewers = days.find(element => element.name === day)?.interviewers;

targetInterviewers && Object.values(interviewers).forEach(element => { 
  if(targetInterviewers.includes(element.id)){
    interviewersForDay.push(element);
  }
});
return interviewersForDay;
}
