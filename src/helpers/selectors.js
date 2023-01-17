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