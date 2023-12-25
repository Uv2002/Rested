import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ClockInOut.css';

function ClockInOut() {
  const [inputValue, setInputValue] = useState('');
  const [employeeData, setEmployeeData] = useState([]);
  const [matchingEmployee, setMatchingEmployee] = useState(null);
  const [clockInOutMessage, setClockInOutMessage] = useState('');
  const [employeeId, setEmployeeId] = useState('');


  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // find employee with input name
    const matchingEmployee = employeeData.find(
      (employee) => employee.name.toLowerCase() === inputValue.toLowerCase()
    );

    if (matchingEmployee) {
      setMatchingEmployee(matchingEmployee);
      setEmployeeId(matchingEmployee._id); // keep track of employeeId
    } else {
      console.log('No matching employee found');
    }

    // reset the input value after submission
    setInputValue('');
  };



  const handleClockIn = async () => {
    if (matchingEmployee) {
      if (matchingEmployee.clockedIn === false) {
        const currentTime = new Date().toLocaleTimeString();
        setClockInOutMessage(`Clocked in at ${currentTime}. Have a great shift!`);
        
        // change employee's clockedIn attribute to true
        setMatchingEmployee((prevEmployee) => ({
          ...prevEmployee,
          clockedIn: true,
        }));
        // send a request to update clockedIn and timeIn in the database
        await updateEmployeeStatus(true, currentTime);
      
      } else {
        setClockInOutMessage('You are already clocked in!');
      }
    }
  };

  const handleClockOut = async () => {
    if (matchingEmployee) {
      if (matchingEmployee.clockedIn === true) {
        const currentTime = new Date();
        const formattedCurrentTime = currentTime.toLocaleTimeString();
  
        const timeIn = new Date(matchingEmployee.timeIn); // get timeIn from database and make it a Date object

        const millisecondsWorked = currentTime.getTime() - timeIn.getTime(); // get milliseconds worked
        const hoursWorked = Math.floor(millisecondsWorked / (1000 * 60 * 60));
        const minutesWorked = Math.floor((millisecondsWorked % (1000 * 60 * 60)) / (1000 * 60));
  
        setClockInOutMessage(`Clocked out at ${formattedCurrentTime}. You worked for ${hoursWorked} hours and ${minutesWorked} minutes. Have a nice day!`);
  
        // change clockedIn attribute to false
        setMatchingEmployee((prevEmployee) => ({
          ...prevEmployee,
          clockedIn: false,
        }));
        // send a request to update clockedIn andn timeOut in the database
        await updateEmployeeStatus(false, currentTime);
      } else {
        setClockInOutMessage('You are already clocked out!');
      }
    }
  };


  const updateEmployeeStatus = async (newClockedInStatus, currentTime) => {
    try {
      //update clockedIn
      const requestBody = {
        clockedIn: newClockedInStatus,
      };
  
      const formattedTime = newClockedInStatus ? new Date() : new Date(currentTime);

      if (newClockedInStatus) {
        // if clocking in, update timeIn
        requestBody.timeIn = formattedTime;
      } else {
        // if clocking out, update timeOut
        requestBody.timeOut = formattedTime;
      }
  
      const res = await fetch(`/api/employees/${employeeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      if (res.ok) {
        console.log('Employee status updated successfully');
        
      } else {
        console.error('Failed to update employee status');
      }
    } catch (error) {
      console.error('Error updating employee status:', error);
    }
  };


  useEffect(() => {
    const fetchEmployeeData = async () => {
      const res = await fetch('/api/employees');
      if (res.ok) {
        const data = await res.json();
        setEmployeeData(data);
        data.forEach(employee => console.log(employee.name)); //log employee names for testing
      }
    };

    fetchEmployeeData();
  }, []);


  const goBack = () => {
    setMatchingEmployee(null); //set matchingEmployee back to null to render the first page
    setClockInOutMessage('');
    window.location.reload(); // reload the page instead of just rendering because sometimes the data it refers to is not updated
  };

  // render different content depending on if normal employee or manager
  const renderContent = () => {
    if (matchingEmployee) {
      if (matchingEmployee.position.toLowerCase() === "manager") { // if manager, render different content
        return (
          <div>
            <p><span className="hello-text">Hello {matchingEmployee.name.charAt(0).toUpperCase() + matchingEmployee.name.slice(1)}!</span></p> {/* capitalize first letter of name */}
            <button className="button-clock-in-out" onClick={handleClockIn}>Clock In</button>
            <button className="button-clock-in-out" onClick={handleClockOut}>Clock Out</button>
            <button className="button-clock-in-out"><Link to="/employee">View Employees</Link></button> {/* go to employee page */}
            <button className="button-clock-in-out" onClick={goBack}>Back</button>
            <p>{clockInOutMessage}</p>
        </div>
        );
      } else { //if normal employee
      return (
        <div>
          <p><span className="hello-text">Hello {matchingEmployee.name.charAt(0).toUpperCase() + matchingEmployee.name.slice(1)}!</span></p> {/* capitalize first letter of name */}
          <button className="button-clock-in-out" onClick={handleClockIn}>Clock In</button>
          <button className="button-clock-in-out" onClick={handleClockOut}>Clock Out</button>
          <button className="button-clock-in-out" onClick={goBack}>Back</button>
          <p>{clockInOutMessage}</p>
        </div>
      );
      }
    } else {
      return (
        <form onSubmit={handleSubmit}>
          <label>
            Enter your name:
            <input type="text" value={inputValue} onChange={handleInputChange} />
          </label>
          <button className="button-clock-in-out">Submit</button>
        </form>
      );
    }
  };

  return <div className="container">{renderContent()}</div>;
}

export default ClockInOut;