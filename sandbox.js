let courseData = [];
let daylist_public = {};
let algo_public = [];
let list_of_ai=[];
let total_time_free_in_week=[];
let all_week_name=['Saturday','Sunday' ,'Monday' ,'Tuesday' ,'Wednesday','Thursday' ];
let check = true;
let ddd='day';
let count_for_schedulle = 1;
let filter0=999999999; // high value to ensure that first comparasion in became true
let filter1=999999999;

function addCourseFields() {
    const numberOfFields = prompt("Enter the number of sets of course details:");
    // const numberOfFields2 = prompt("Enter the number of sets of course details:");
    const numFields = parseInt(numberOfFields, 10);

    if (!isNaN(numFields) && numFields > 0) {
        const dynamicFields = document.getElementById('dynamic-fields');
        dynamicFields.innerHTML = ''; // Clear any existing fields

        for (let i = 1; i <= numFields; i++) {
            const fieldSet = document.createElement('div');
            fieldSet.className = 'course-input';
            fieldSet.innerHTML = `
                <h3>Set ${i}</h3>
                <label for="lecture_or_section_${i}">Type (Lecture/Section):</label>
                <select id="lecture_or_section_${i}" name="lecture_or_section_${i}" required>
                    <option value="Lecture">Lecture</option>
                    <option value="Section">Section</option>
                </select>

                <label for="day_${i}">Day:</label>
                <select id="day_${i}" name="day_${i}" required>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                </select>

                <label for="time_from_${i}">Time From:</label>
                <input type="time" id="time_from_${i}" name="time_from_${i}" required>

                <label for="time_to_${i}">Time To:</label>
                <input type="time" id="time_to_${i}" name="time_to_${i}" required>
            `;
            dynamicFields.appendChild(fieldSet);
        }
    } else {
        alert("Please enter a valid positive number.");
    }
}

function storeData() {
    const form = document.getElementById('course-form');
    const formData = new FormData(form);

    if (formData.get('course_code') == "" || formData.get('course_name') == "" || formData.get('room_number') == "") {
        alert("Please fill all data.");
        return;
    }

    const courseDetails = {
        courseCode: formData.get('course_code'),
        courseName: formData.get('course_name'),
        roomNumber: formData.get('room_number'),
        details: { lecture: [], section: [] }
    };

    for (let pair of formData.entries()) {
        if (pair[0].includes('lecture_or_section_')) {
            const index = pair[0].split('_')[3];
            if (pair[1] == 'Lecture') {
                courseDetails.details.lecture.push({
                    lectureOrSection: pair[1],
                    day: formData.get(`day_${index}`),
                    timeFrom: formData.get(`time_from_${index}`),
                    timeTo: formData.get(`time_to_${index}`)
                });
            } else {
                courseDetails.details.section.push({
                    lectureOrSection: pair[1],
                    day: formData.get(`day_${index}`),
                    timeFrom: formData.get(`time_from_${index}`),
                    timeTo: formData.get(`time_to_${index}`)
                });
            }
        }
    }
    courseData.push(courseDetails);
    alert("Data stored successfully!");
    // console.log(formData.entries());
    // console.log(courseData);
    // console.log(courseDetails.details.length);
}

// this is shortcut for function ( coursedata , index , list that contain all days and time in that day , the schedull of the data collected )
function algorithm(det, ind, daylist, algo , value_for_user_demond) {
    // console.log('Processing course data');
    if (ind == courseData.length) {
        // console.log('End of course data. Final algo:', JSON.stringify(algo));
        console.log("schedulle in algorathm function !!!!!!!!!!!!!!!");
        let return_value=for_filter(algo,value_for_user_demond);
        if (return_value[0] <= filter0 && return_value[1] <= filter1) {
            filter1=return_value[1];
            filter0=return_value[0];
            list_of_ai.push(JSON.parse(JSON.stringify(algo))); // Ensure deep copy of algo
        }
        return;
    }
    det.details.lecture.forEach(lecture_value => {
        let x_lecture = lecture_value.day;
        let time_F = lecture_value.timeFrom;
        let time_t = lecture_value.timeTo;
        let [hours, minutes] = time_F.split(':');
        let float_time_f = parseInt(hours) + parseInt(minutes) / 60;
        let [h, m] = time_t.split(':');
        let float_time_t = parseInt(h) + parseInt(m) / 60;
        let timevalue = [float_time_f, float_time_t];
        let lecture_time=timevalue;
        // console.log(daylist);
        if (!Object.keys(daylist).includes(lecture_value.day)) {
            daylist[x_lecture] = [];
            daylist[x_lecture].push(timevalue);
        } else {
            if (daylist[x_lecture].some(tv => tv[0] === timevalue[0] && tv[1] === timevalue[1])) {
                return;
            } else {
                for (let i = 0; i < daylist[x_lecture].length; i++) {
                    if ( (timevalue[0] >= daylist[x_lecture][i][0] && timevalue[0] < daylist[x_lecture][i][1] ) ||
                         (timevalue[0] <= daylist[x_lecture][i][0] && timevalue[1] >= daylist[x_lecture][i][1] )  ) {
                        
                        check = false;
                        break;
                    }
                    if ( ( timevalue[1] > daylist[x_lecture][i][0] && timevalue[1] <= daylist[x_lecture][i][1] ) ||
                         ( timevalue[0] < daylist[x_lecture][i][1] && timevalue[1] > daylist[x_lecture][i][0] ) ) {
                            
                        check = false;
                        break;


                            // this is old check
                            // 1 → ( timevalue[1] >= daylist[x_lecture][i][0] && timevalue[1] <= daylist[x_lecture][i][1] )
                            // 2 → (timevalue[0] >= daylist[x_lecture][i][0] && timevalue[0] < daylist[x_lecture][i][1] )


                        // (newTime[0] < existing[1] && newTime[1] > existing[0]) || is done
                        // (newTime[0] >= existing[0] && newTime[0] < existing[1]) ||  is done 
                        // (newTime[1] > existing[0] && newTime[1] <= existing[1]) ||
                        // (newTime[0] <= existing[0] && newTime[1] >= existing[1])   is done
                    }
                }
                if (!check) {
                    check = true;
                    return;
                } else {
                    daylist[x_lecture].push(timevalue);
                }
            }
        }
        // this for check that section have value or not
        // if (det.details.section.day) {
            // console.log('ahmed saad abdelsatar');
            let section_counter=0;
            let len=det.details.section.length;
            det.details.section.forEach(section_value => {
                section_counter = section_counter + 1;
                let x_section = section_value.day;
                let time_F = section_value.timeFrom;
                let time_t = section_value.timeTo;
                let [hours, minutes] = time_F.split(':');
                let float_time_f = parseInt(hours) + parseInt(minutes) / 60;
                let [h, m] = time_t.split(':');
                let float_time_t = parseInt(h) + parseInt(m) / 60;
                let timevalue = [float_time_f, float_time_t];
                let section_time=timevalue;
                // console.log(daylist);
                
                if (!Object.keys(daylist).includes(section_value.day)) {
                    daylist[x_section] = [];
                    daylist[x_section].push(timevalue);
                    algo.push({
                        courseCode: det.courseCode,
                        courseName: det.courseName,
                        roomNumber: det.roomNumber,
                        details: { lecture: [lecture_value], section: [section_value] }
                    });
                    algorithm(courseData[ind + 1], ind + 1, daylist, algo,value_for_user_demond);
                    algo.pop();
                    let l = daylist[x_section].filter(index=> index !== section_time );
                    daylist[x_section]=l;
    
                } else {
                    if (daylist[x_section].some(tv => tv[0] === timevalue[0] && tv[1] === timevalue[1]))
                    {
                        // console.log('here he is check that the time is aready exist in feild section');
                        return;
                        
                    } else {
                        for (let i = 0; i < daylist[x_section].length; i++) {
                            if (timevalue[0] >= daylist[x_section][i][0] && timevalue[0] < daylist[x_section][i][1]) {
                                // console.log('here he is check that the time is between any time ');
                                check = false;
                                break;
                            }
                            if ( timevalue[1] >= daylist[x_section][i][0] && timevalue[1] <= daylist[x_section][i][1]) {
                            
                                check = false;
                                break;
                            }
                            
                        }
                        if (!check) {
                            check = true;
                            return;
                        } else {
                            daylist[x_section].push(timevalue);
                            // console.log('aaaaaaaaaaaaaaaaaaaahhhhhhhhhhhh');
                            daylist[x_section].forEach(x_section=>{
                                // console.log(x_section);
                            });
                            algo.push({
                                courseCode: det.courseCode,
                                courseName: det.courseName,
                                roomNumber: det.roomNumber,
                                details: { lecture: [lecture_value], section: [section_value] }
                            });
                            algorithm(courseData[ind + 1], ind + 1, daylist, algo,value_for_user_demond);
                            algo.pop();
                            // console.log('here he will remove a one section time');
                            let l = daylist[x_section].filter(index=> index !== section_time );
                            daylist[x_section]=l;
                        }
                    }
                }
            });
            if (len == 0) {
                algo.push({
                    courseCode: det.courseCode,
                    courseName: det.courseName,
                    roomNumber: det.roomNumber,
                    details: { lecture: [lecture_value], section: [] }
                });
                algorithm(courseData[ind + 1], ind + 1, daylist, algo,value_for_user_demond);
                algo.pop();
                // let l=daylist[x_lecture].filter(index=> index !== lecture_time );
                // daylist[x_lecture]=l;
            }
            
            // فى مشكله هنا 
            // console.log('this is a course counter = ',section_counter);
            // console.log('this is a section length = ',det.details.section.length)
            if (section_counter == det.details.section.length ) {
                // console.log('her he will remove an one lecture time ');
                let l=daylist[x_lecture].filter(index=> index !== lecture_time );
                daylist[x_lecture]=l;
                
            }
        // }else
        // {
        //     console.log('khaled saad abdelsatar');
        //     algo.push({
        //         courseCode: det.courseCode,
        //         courseName: det.courseName,
        //         roomNumber: det.roomNumber,
        //         details: { lecture: [lecture_value], section: [] }
        //     });
        //     algorithm(courseData[ind + 1], ind + 1, daylist, algo);
        // }
        // let l=daylist[x_lecture].filter(index=> index !== lecture_time );
        // daylist[x_lecture]=l;
    });
}





function displayData() {
    const coursesBody = document.getElementById('courses-body');
    coursesBody.innerHTML = '';  // Clear the existing content

    courseData.forEach((course, index) => {
        const row = document.createElement('tr');

        // Generate HTML for lectures
        let lecturesHtml = course.details.lecture.map(lecture => `
            <p><strong>Lecture:</strong> ${lecture.day} ${lecture.timeFrom} - ${lecture.timeTo}</p>
        `).join('');

        // Generate HTML for sections
        let sectionsHtml = course.details.section.map(section => `
            <p><strong>Section:</strong> ${section.day} ${section.timeFrom} - ${section.timeTo}</p>
        `).join('');

        row.innerHTML = `
            <td>${course.courseCode}</td>
            <td>${course.courseName}</td>
            <td>${course.roomNumber}</td>
            <td>${lecturesHtml || 'N/A'}</td>
            <td>${sectionsHtml || 'N/A'}</td>
            <td><button onclick="deleteCourse(${index})">Delete</button></td>
        `;

        coursesBody.appendChild(row);
    });
}
function deleteCourse(index) {
    // Remove the course from the array
    courseData.splice(index, 1);

    // Refresh the displayed data
    displayData();
}




function getBooleanInput() {
    const userInput = prompt("what is the perority in the result of schedule \n 1 → the time between lectures\n 2 → the total day free in the week \n 3 → both \nPlease chosse ( 1 , 2 , 3 ):");
    const data = parseInt(userInput, 10);
    // console.log(data);
    if (data == 1) {
        return 1;
    } else if (data == 2) {
        return 2;
    }else if (data == 3) {
        return 3;
    } else {
        alert("Invalid input. Please enter either '1' or '2' or '3' .");
        return getBooleanInput(); // Recursively call the function again if input is invalid
    }
}










// this is the main function for the algorithm



function make_process() {
    let value = getBooleanInput();
    
    alert("please wait few second untill make all process");
    data_for_test()
    // console.log("this is the main function and this is the length of courses in coursedata => ",courseData.length)
    console.log('Processing started');
    let i = 0;
    algorithm(courseData[i], i, daylist_public, algo_public , value );
    // console.log('Current list_of_ai after make_process:', JSON.stringify(list_of_ai));
    // console.log('Course Data:', JSON.stringify(courseData));
    // Assuming these functions exist
    for_take_best_schedule();
    make_order_to_print_best_schedule();
    console.log("list_of_ai length is => ",list_of_ai.length);
}


function displaySchedule(algo) {
    const scheduleTablesContainer = document.getElementById('schedule-tables');
    
    // Create a new table for the current schedule
    const table = document.createElement('table');
    table.border = 1;
    table.innerHTML = `
    <thead>
        <tr>
            <th colspan="7">Schedule ${count_for_schedulle}</th>
        </tr>
        <tr>
            <th>Time</th>
            <th>Saturday</th>
            <th>Sunday</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
        </tr>
    </thead>
    <tbody id="schedule-body-${count_for_schedulle}">
        <!-- Rows will be added here dynamically -->
    </tbody>
    `;
    
    const scheduleBody = table.querySelector(`#schedule-body-${count_for_schedulle}`);
    const timeSlots = {};
    
    algo.forEach(course => {
        const allDetails = [...course.details.lecture, ...course.details.section]; // Combine lecture and section details
    
        allDetails.forEach(detail => {
            const timeRange = `${detail.timeFrom} - ${detail.timeTo}`;
    
            if (!timeSlots[timeRange]) {
                timeSlots[timeRange] = {
                    Saturday: '',
                    Sunday: '',
                    Monday: '',
                    Tuesday: '',
                    Wednesday: '',
                    Thursday: ''
                };
            }
    
            timeSlots[timeRange][detail.day] += `
                ${course.courseName} (${course.courseCode})<br>
                ${detail.lectureOrSection} (${course.roomNumber})
            `;
        });
    });
    
    Object.keys(timeSlots).forEach(time => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${time}</td>
            <td>${timeSlots[time].Saturday || ''}</td>
            <td>${timeSlots[time].Sunday || ''}</td>
            <td>${timeSlots[time].Monday || ''}</td>
            <td>${timeSlots[time].Tuesday || ''}</td>
            <td>${timeSlots[time].Wednesday || ''}</td>
            <td>${timeSlots[time].Thursday || ''}</td>
        `;
        scheduleBody.appendChild(row);
    });
    
    // Create a download button
    const downloadButton = document.createElement('button');
    downloadButton.innerText = `Download Schedule ${count_for_schedulle}`;
    downloadButton.onclick = function() {
        downloadSchedule(table, count_for_schedulle);
    };
    
    // Append the new table and download button to the container
    scheduleTablesContainer.appendChild(table);
    scheduleTablesContainer.appendChild(downloadButton);
    
    // Increment the count for the next schedule
    count_for_schedulle++;
}

function downloadSchedule(table, count_for_schedulle) {
    // Create a new Blob from the table's HTML content
    const tableHtml = table.outerHTML;
    const blob = new Blob([tableHtml], { type: 'text/html' });
    
    // Create a download link and trigger the download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Schedule_${count_for_schedulle}.html`;
    link.click();
}



// function displaySchedule(algo) {
    
//     const scheduleTablesContainer = document.getElementById('schedule-tables');
    
//     // Create a new table for the current schedule
//     const table = document.createElement('table');
//     table.border = 1;
//     table.innerHTML = `
//     <thead>
//         <tr>
//             <th colspan="7"  style="color: #cfcdd6;"><h3>Schedule ${count_for_schedulle}</h3></th>
//         </tr>
//         <tr>
//             <th >Time</th>
//             <th>Saturday</th>
//             <th>Sunday</th>
//             <th>Monday</th>
//             <th>Tuesday</th>
//             <th>Wednesday</th>
//             <th>Thursday</th>
//         </tr>
//     </thead>
//     <tbody id="schedule-body-${count_for_schedulle}">
//         <!-- Rows will be added here dynamically -->
//     </tbody>
//     `;
    
//     const scheduleBody = table.querySelector(`#schedule-body-${count_for_schedulle}`);
//     const timeSlots = {};
    
//     algo.forEach(course => {
//         const allDetails = [...course.details.lecture, ...course.details.section]; // Combine lecture and section details
    
//         allDetails.forEach(detail => {
//             const timeRange = `${detail.timeFrom} - ${detail.timeTo}`;
    
//             if (!timeSlots[timeRange]) {
//                 timeSlots[timeRange] = {
//                     Saturday: '',
//                     Sunday: '',
//                     Monday: '',
//                     Tuesday: '',
//                     Wednesday: '',
//                     Thursday: ''
//                 };
//             }
    
//             timeSlots[timeRange][detail.day] += `
//                 ${course.courseName} (${course.courseCode})<br>
//                 ${detail.lectureOrSection} (${course.roomNumber})
//             `;
//         });
//     });
    
//     Object.keys(timeSlots).forEach(time => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${time}</td>
//             <td>${timeSlots[time].Saturday || ''}</td>
//             <td>${timeSlots[time].Sunday || ''}</td>
//             <td>${timeSlots[time].Monday || ''}</td>
//             <td>${timeSlots[time].Tuesday || ''}</td>
//             <td>${timeSlots[time].Wednesday || ''}</td>
//             <td>${timeSlots[time].Thursday || ''}</td>
//         `;
//         scheduleBody.appendChild(row);
//     });
    
//     // Append the new table to the container
//     scheduleTablesContainer.appendChild(table);
    
//     // Increment the count for the next schedule
//     count_for_schedulle++;
// }

// function displaySchedule(algo) {
//     const scheduleTablesContainer = document.getElementById('schedule-tables');
    
//     // Create a new table for the current schedule
//     const table = document.createElement('table');
//     table.border = 1;
//     table.innerHTML = `
//         <thead>
//             <tr>
//                 <th>Time</th>
//                 <th>Saturday</th>
//                 <th>Sunday</th>
//                 <th>Monday</th>
//                 <th>Tuesday</th>
//                 <th>Wednesday</th>
//                 <th>Thursday</th>
//             </tr>
//         </thead>
//         <tbody id="schedule-body">
//             <!-- Rows will be added here dynamically -->
//         </tbody>
        
//     `;

//     const scheduleBody = table.querySelector(`#schedule-body`);
//     const timeSlots = {};

//     algo.forEach(course => {
//         const allDetails = [...course.details.lecture, ...course.details.section]; // Combine lecture and section details

//         allDetails.forEach(detail => {
//             const timeRange = `${detail.timeFrom} - ${detail.timeTo}`;

//             if (!timeSlots[timeRange]) {
//                 timeSlots[timeRange] = {
//                     Saturday: '',
//                     Sunday: '',
//                     Monday: '',
//                     Tuesday: '',
//                     Wednesday: '',
//                     Thursday: ''
//                 };
//             }

//             timeSlots[timeRange][detail.day] += `
//                 ${course.courseName} (${course.courseCode})<br>
//                 ${detail.lectureOrSection} (${course.roomNumber})
//                 <br>
//                 <br>
//                 <br>
//             `;
//         });
//     });

//     Object.keys(timeSlots).forEach(time => {
//         const row = document.createElement('tr');
//         row.innerHTML = `
//             <td>${time}</td>
//             <td>${timeSlots[time].Saturday || ''}</td>
//             <td>${timeSlots[time].Sunday || ''}</td>
//             <td>${timeSlots[time].Monday || ''}</td>
//             <td>${timeSlots[time].Tuesday || ''}</td>
//             <td>${timeSlots[time].Wednesday || ''}</td>
//             <td>${timeSlots[time].Thursday || ''}</td>
        
//             `;
//         scheduleBody.appendChild(row);
//     });

//     // Append the new table to the container
//     scheduleTablesContainer.appendChild(table);

// }

function for_filter(the_schedule , value_for_user_demond ){
    let day_of_week={
        'Saturday':{'count_of_lecture':0 , 'time':[] },   
        'Sunday':{'count_of_lecture':0 , 'time':[] },
        'Monday':{'count_of_lecture':0 , 'time':[] }, 
        'Tuesday':{'count_of_lecture':0 , 'time':[] }, 
        'Wednesday':{'count_of_lecture':0 , 'time':[] },
        'Thursday':{'count_of_lecture':0 , 'time':[] }
    }
    the_schedule.forEach(course=>{
        // console.log(course.details.lecture.length);
        if (course.details.lecture.length > 0) {
            d=course.details.lecture[0].day;
            // console.log(d);
            day_of_week[d].count_of_lecture += 1;
            let time_F = course.details.lecture[0].timeFrom;
            let time_t = course.details.lecture[0].timeTo;
            let [hours, minutes] = time_F.split(':');
            let float_time_f = parseInt(hours) + parseInt(minutes) / 60;
            let [h, m] = time_t.split(':');
            let float_time_t = parseInt(h) + parseInt(m) / 60;
            let timevalue = [float_time_f, float_time_t];
            day_of_week[d].time.push(timevalue);
        }
        if (course.details.section.length > 0) {
            d=course.details.section[0].day;
            // console.log(d);
            day_of_week[d].count_of_lecture +=1;
            let time_F = course.details.section[0].timeFrom;
            let time_t = course.details.section[0].timeTo;
            let [hours, minutes] = time_F.split(':');
            let float_time_f = parseInt(hours) + parseInt(minutes) / 60;
            let [h, m] = time_t.split(':');
            let float_time_t = parseInt(h) + parseInt(m) / 60;
            let timevalue = [float_time_f, float_time_t];
            day_of_week[d].time.push(timevalue);
        }
    });
    
    let sum=0;
    let time_sum=0;
    all_week_name.forEach(name=>{
        if (value_for_user_demond != 2) {
            day_of_week[name].time.sort((a,b)=> a[0]-b[0]);
        // time_sum -=2;
            for (let index = 1; index < day_of_week[name].time.length; index++) {
            time_sum += day_of_week[name].time[index][1] - day_of_week[name].time[index-1][0];
        }
        }
        if (day_of_week[name].count_of_lecture == 0 ) {
            sum -= 1 ;
        }
    });
    // console.log("\n\n\n\n\n",day_of_week,"\n\n\n\n");
    let for_return=[sum,time_sum];
    return for_return;

}






function for_take_best_schedule(){
    
    list_of_ai.forEach((schedule,index)=>{
        let day_of_week={
            'Saturday':0,   
            'Sunday':0,
            'Monday':0, 
            'Tuesday':0, 
            'Wednesday':0,
            'Thursday':0
        }
        schedule.forEach(course=>{
            // console.log(course.details.lecture.length);
            if (course.details.lecture.length > 0) {
                d=course.details.lecture[0].day;
                // console.log(d);
                day_of_week[d] += 1;
            }
            if (course.details.section.length > 0) {
                d=course.details.section[0].day;
                // console.log(d);
                day_of_week[d] +=1;
            }
        })
        // console.log(day_of_week);
        let sum=0;
        all_week_name.forEach(name=>{
            if (day_of_week[name] == 0 ) {
                sum -= 1 ;
            }
        });
        total_time_free_in_week.push([sum,index]);
    });
}
function make_order_to_print_best_schedule(){

    total_time_free_in_week.sort();
    // console.log(total_time_free_in_week);
    let i=total_time_free_in_week.length;
    let counter=10;
    while (counter--) {
        let v = total_time_free_in_week[--i];
        // console.log(v);
        displaySchedule(list_of_ai[v[1]]);
        // counter
    }
}
// let day_of_week={
//     'Saturday':0,   
//     'Sunday':0,
//     'Monday':0, 
//     'Tuesday':0, 
//     'Wednesday':0,
//     'Thursday':0
// }
function data_for_test(){
    let data1 = {
        courseCode: 'cs281',
        courseName: 'operating system',
        roomNumber: '219a',
        details: 
        { lecture: 
            [   
                {lectureOrSection: 'Lecture',day: 'Sunday',timeFrom: '09:00',timeTo: '11:00'},
                {lectureOrSection: 'Lecture',day: 'Tuesday',timeFrom: '15:00',timeTo: '18:00'}
            ], section: 
            [
                {lectureOrSection: 'Section',day: 'Saturday',timeFrom: '09:00',timeTo: '11:00'},
                {lectureOrSection: 'Section',day: 'Saturday',timeFrom: '11:00',timeTo: '13:00'},
                {lectureOrSection: 'Section',day: 'Saturday',timeFrom: '13:00',timeTo: '15:00'},
                {lectureOrSection: 'Section',day: 'Monday',timeFrom: '13:00',timeTo: '15:00'},
                {lectureOrSection: 'Section',day: 'Monday',timeFrom: '15:00',timeTo: '18:00'},
                {lectureOrSection: 'Section',day: 'Wednesday',timeFrom: '09:00',timeTo: '11:00'},
                {lectureOrSection: 'Section',day: 'Wednesday',timeFrom: '11:00',timeTo: '13:00'},
                {lectureOrSection: 'Section',day: 'Wednesday',timeFrom: '13:00',timeTo: '15:00'},
                {lectureOrSection: 'Section',day: 'Wednesday',timeFrom: '15:00',timeTo: '18:00'}
            ]
        }
    };
    let data2 = {
        courseCode: 'is321',
        courseName: 'systems analysis',
        roomNumber: '219a',
        details: 
        { lecture: 
            [   
                {lectureOrSection: 'Lecture',day: 'Monday',timeFrom: '09:00',timeTo: '11:00'},
                {lectureOrSection: 'Lecture',day: 'Tuesday',timeFrom: '09:00',timeTo: '11:00'}
            ], section: 
            [
                {lectureOrSection: 'Section',day: 'Sunday',timeFrom: '09:00',timeTo: '11:00'},
                {lectureOrSection: 'Section',day: 'Sunday',timeFrom: '11:00',timeTo: '13:00'},
                {lectureOrSection: 'Section',day: 'Sunday',timeFrom: '15:00',timeTo: '18:00'},
                {lectureOrSection: 'Section',day: 'Monday',timeFrom: '09:00',timeTo: '11:00'},
                {lectureOrSection: 'Section',day: 'Monday',timeFrom: '11:00',timeTo: '13:00'},
                {lectureOrSection: 'Section',day: 'Monday',timeFrom: '13:00',timeTo: '15:00'},
                {lectureOrSection: 'Section',day: 'Monday',timeFrom: '15:00',timeTo: '18:00'}
            ]
        }
    };
    let data3 = {
        courseCode: 'cs341',
        courseName: 'software engineering',
        roomNumber: '219a',
        details: 
        { lecture: 
            [   
                {lectureOrSection: 'Lecture',day: 'Sunday',timeFrom: '13:00',timeTo: '15:00'},
                {lectureOrSection: 'Lecture',day: 'Wednesday',timeFrom: '15:00',timeTo: '18:00'}
            ], section: 
            [
                {lectureOrSection: 'Section',day: 'Saturday',timeFrom: '09:00',timeTo: '11:00'},
                {lectureOrSection: 'Section',day: 'Saturday',timeFrom: '11:00',timeTo: '13:00'},
                {lectureOrSection: 'Section',day: 'Saturday',timeFrom: '13:00',timeTo: '15:00'},
                {lectureOrSection: 'Section',day: 'Tuesday',timeFrom: '09:00',timeTo: '11:00'},
                {lectureOrSection: 'Section',day: 'Tuesday',timeFrom: '11:00',timeTo: '13:00'},
                {lectureOrSection: 'Section',day: 'Tuesday',timeFrom: '15:00',timeTo: '18:00'}
            ]
        }
    };
    let data4 = {
        courseCode: 'cs311',
        courseName: 'assymply',
        roomNumber: '219a',
        details: 
        { lecture: 
            [   
                {lectureOrSection: 'Lecture',day: 'Saturday',timeFrom: '15:00',timeTo: '18:00'},
                {lectureOrSection: 'Lecture',day: 'Sunday',timeFrom: '15:00',timeTo: '18:00'}
            ], section: 
            [
                {lectureOrSection: 'Section',day: 'Monday',timeFrom: '09:00',timeTo: '11:00'},
                {lectureOrSection: 'Section',day: 'Monday',timeFrom: '11:00',timeTo: '13:00'},
                {lectureOrSection: 'Section',day: 'Monday',timeFrom: '13:00',timeTo: '15:00'},
                {lectureOrSection: 'Section',day: 'Monday',timeFrom: '15:00',timeTo: '18:00'},
                {lectureOrSection: 'Section',day: 'Wednesday',timeFrom: '09:00',timeTo: '11:00'},
                {lectureOrSection: 'Section',day: 'Wednesday',timeFrom: '11:00',timeTo: '13:00'}
            ]
        }
    };
    let data5 = {
        courseCode: 'cs331',
        courseName: 'algorithm',
        roomNumber: '219a',
        details: 
        { lecture: 
            [   
                {lectureOrSection: 'Lecture',day: 'Sunday',timeFrom: '15:00',timeTo: '18:00'},
                {lectureOrSection: 'Lecture',day: 'Wednesday',timeFrom: '13:00',timeTo: '15:00'}
            ], section: 
            [
                {lectureOrSection: 'Section',day: 'Sunday',timeFrom: '09:00',timeTo: '11:00'},
                {lectureOrSection: 'Section',day: 'Sunday',timeFrom: '11:00',timeTo: '13:00'},
                {lectureOrSection: 'Section',day: 'Sunday',timeFrom: '13:00',timeTo: '15:00'},
                {lectureOrSection: 'Section',day: 'Sunday',timeFrom: '15:00',timeTo: '18:00'},
                {lectureOrSection: 'Section',day: 'Monday',timeFrom: '11:00',timeTo: '13:00'},
                {lectureOrSection: 'Section',day: 'Monday',timeFrom: '13:00',timeTo: '15:00'},
                {lectureOrSection: 'Section',day: 'Monday',timeFrom: '15:00',timeTo: '18:00'}
            ]
        }
    };
    let data6 = {
        courseCode: 'is311',
        courseName: 'file operation',
        roomNumber: '219a',
        details: 
        { lecture: 
            [   
                {lectureOrSection: 'Lecture',day: 'Sunday',timeFrom: '11:00',timeTo: '13:00'},
                {lectureOrSection: 'Lecture',day: 'Tuesday',timeFrom: '11:00',timeTo: '13:00'}
            ], section: 
            [
                {lectureOrSection: 'Section',day: 'Saturday',timeFrom: '09:00',timeTo: '11:00'},
                {lectureOrSection: 'Section',day: 'Saturday',timeFrom: '11:00',timeTo: '13:00'},
                {lectureOrSection: 'Section',day: 'Saturday',timeFrom: '13:00',timeTo: '15:00'},
                {lectureOrSection: 'Section',day: 'Monday',timeFrom: '11:00',timeTo: '13:00'},
                {lectureOrSection: 'Section',day: 'Wednesday',timeFrom: '09:00',timeTo: '11:00'},
                {lectureOrSection: 'Section',day: 'Wednesday',timeFrom: '11:00',timeTo: '13:00'},
                {lectureOrSection: 'Section',day: 'Wednesday',timeFrom: '13:00',timeTo: '15:00'},
                {lectureOrSection: 'Section',day: 'Wednesday',timeFrom: '15:00',timeTo: '18:00'}
            ]
        }
    };
    let data7 = {
        courseCode: 'eng201',
        courseName: 'English',
        roomNumber: '219a',
        details: 
        { lecture: 
            [   
                {lectureOrSection: 'Lecture',day: 'Sunday',timeFrom: '12:00',timeTo: '15:00'},
                {lectureOrSection: 'Lecture',day: 'Tuesday',timeFrom: '12:00',timeTo: '15:00'}
            ], section: 
            [
                
            ]
        }
    };
    courseData.push(data1);
    courseData.push(data2);
    courseData.push(data3);
    courseData.push(data6);
    courseData.push(data4);
    courseData.push(data5);
    courseData.push(data7);

    
}



