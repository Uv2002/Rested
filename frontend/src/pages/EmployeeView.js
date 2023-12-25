import React, { useState, useEffect } from 'react';
import './MapView.css';
import Sidebar, { SidebarItem } from '../components/sidebar';
import {useTheme} from '../context/ThemeContext';
import {
    Settings,
    HelpCircle,
} from "lucide-react"

const EmployeeCard = ({theme, employee, setEmployee, submitEmployee, deleteEmployee}) => {
    const [edit, setEdit] = useState(false);

    const accessibilityStyle = (theme) => {
        return `bg-${theme}-secondary text-${theme}-text  hover:bg-${theme}-primary transition duration-300`
    }

    return (
        <div className='reserve-card'>
            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    submitEmployee(employee);
                    setEdit(false);
                }}
            >
            {!edit && <>
                <h2>{employee.name} ({employee.position})</h2>
                <div className="info-string">Employee SIN: {employee.SIN}</div>
                <div className="info-string">Address: {employee.address}</div>
                <div className="info-string">Phone number: {employee.phoneNumber}</div>
                <div className="info-string" style={{marginBottom: '10px'}}>Email: {employee.email}</div>
            </>}
            {edit && <>
                <label>Employee name: </label>
                <input type='text'
                className='reserve-edit large' value={employee.name} onChange={(e) => setEmployee({...employee, name: e.target.value})}/>
                <br/>
                <label>Employee position: </label>
                <input type='text'
                className='reserve-edit large' value={employee.position} onChange={(e) => setEmployee({...employee, position: e.target.value})}/>
                <br/>
                <label>Employee SIN: </label>
                <input type='text'
                className='reserve-edit large' value={employee.SIN} onChange={(e) => setEmployee({...employee, SIN: e.target.value})}/>
                <br/>
                <label>Employee address: </label>
                <input type='text'
                className='reserve-edit large' value={employee.address} onChange={(e) => setEmployee({...employee, address: e.target.value})}/>
                <br/>
                <label>Phone number: </label>
                <input type='text'
                className='reserve-edit large' value={employee.phoneNumber} onChange={(e) => setEmployee({...employee, phoneNumber: e.target.value})}/>
                <br/>
                <label>Email: </label>
                <input type='text'
                className='reserve-edit large' value={employee.email} onChange={(e) => setEmployee({...employee, email: e.target.value})}/>
            </>}
            <br/>
            {!edit && <button className={accessibilityStyle(theme)} onClick={() => setEdit(!edit)}>Edit</button>}
            {edit && <button type="submit" className={'active'} onClick={() =>{ submitEmployee(employee); setEdit(false)}}>Submit</button>}
            {edit && <button className={accessibilityStyle(theme)} onClick={() => setEdit(false)}>Cancel</button>}
            {edit && <button className='red' onClick={() => deleteEmployee(employee)}>Delete</button>}
            </form>
        </div>
    )
}

function EmployeeView() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchEmployeesStatus = async () => {
            const res = await fetch('/api/employees');
            const data = await res.json();
            if (res.ok) {
                setEmployees(data)
                console.log(data)
            }
        };
        fetchEmployeesStatus();
    }, []) //empty array signifies that this function will only run once

    const patchEmployee = async (employee) => {
        const res = await fetch(`/api/employees/${employee._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employee)
        })
        const data = await res.json();
        if (res.ok) {
            console.log(data)
        }
    }

    const deleteEmployee = async (employee) => {
        setEmployees(employees.filter((d) => d._id !== employee._id))
        const res = await fetch(`/api/employees/${employee._id}`, {
            method: 'DELETE',
        })
        const data = await res.json();
        if (res.ok) {
            console.log(data)
        }
    }
    
    const createEmployee = async (employee) => {
        const res = await fetch('/api/employees', {
            method: 'POST',
            mode: 'cors', 
            headers: { 'Content-Type': 'application/json' }, // this is what was missing all this time
            body: JSON.stringify(employee),
        });
        //const data = await res.json();
        if (res.ok) {
            console.log("CREATED Employee: ", employee.name);
            console.log("WITH DATA: ", employee);
            // need to get employee info from response
            const data = await res.json();
            setEmployees([...employees, data]);
        } else {
            console.log("ERROR: ", res);
        }
    }

    const newEmployee = {
        name: "New Employee",
        position: "Unknown",
    }

    // Accessibility theme stuff
    const [getHelpMenuActive, setHelpMenuActive] = useState(false);
    const [showThemeSelector, setShowThemeSelector] = useState(false);
    const { theme } = useTheme();
    const toggleHelpMenu = () => {
        setHelpMenuActive(!getHelpMenuActive);
    }
    const toggleThemeSelector = () => {
        setShowThemeSelector(!showThemeSelector);
    };

    return (
    <main className='ReservationView'>
        <div className='flex min-h-screen fixed z-10'>
            {/* adding Sidebar to EmployeeView */}
            <Sidebar>
                {/* Adding items in the sidebar here */}
                <SidebarItem icon={<Settings size={20} />} text="Settings" onPress={toggleThemeSelector} />
                <SidebarItem icon={<HelpCircle size={20} />} text="Help" onPress={toggleHelpMenu} />
            </Sidebar>
        </div>
        <div className='reservation-view-contents'>
            <h1>Employee Database</h1>
            <div className='reservation-grid-view'>
                {employees.map((employee) => (
                    <EmployeeCard
                        key={employee._id} 
                        theme={theme}
                        employee={employee} 
                        setEmployee={(newEmployee) =>
                            {
                                setEmployees(employees.map((d) => (d._id === employee._id ? newEmployee : d)))
                            }
                        }
                        submitEmployee={patchEmployee}
                        deleteEmployee={deleteEmployee}
                    />
                ))}
                <div className='reservation-card'>
                        <button className='centered active' onClick={() => createEmployee(newEmployee)}>Create New Employee</button>
                </div>
            </div>
        </div>
    </main>)
}

export default EmployeeView;