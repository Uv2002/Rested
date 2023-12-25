import React, { useState, useEffect } from 'react';
import './MapView.css';
import Sidebar, { SidebarItem } from '../components/sidebar';
import {useTheme} from '../context/ThemeContext';
import {
    Settings,
    HelpCircle,
} from "lucide-react"

const ReservationCard = ({theme, reserve, setReserve, submitReserve, deleteReserve}) => {
    const [edit, setEdit] = useState(false);

    const accessibilityStyle = (theme) => {
        return `bg-${theme}-secondary text-${theme}-text  hover:bg-${theme}-primary transition duration-300`
    }

    return (
        <div className='reserve-card'>
            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    submitReserve(reserve);
                    setEdit(false);
                }}
            >
            {!edit && <>
                <h2>{reserve.title} ({reserve.reservationDate.substring(0, 10)} at {reserve.reservationDate.substring(11, 16)})</h2>
                <div className="info-string">Customer name: {reserve.customerName}</div>
                <div className="info-string">Group size: {reserve.groupSize}</div>
                <div className="info-string">Phone number: {reserve.customerPhone}</div>
                <div className="info-string" style={{marginBottom: '10px'}}>Email: {reserve.customerEmail}</div>
            </>}
            {edit && <>
                <label>Title card: </label>
                <input type='text' className='reserve-edit large' 
                value={reserve.title} onChange={(e) => setReserve({...reserve, title: e.target.value})}/>
                <br/>
                <label>Customer name: </label>
                <input type='text' className='reserve-edit large' 
                value={reserve.customerName} onChange={(e) => setReserve({...reserve, customerName: e.target.value})}/>
                <br/>
                <label>Reserved date: </label>
                <input type='datetime-local' 
                value={reserve.reservationDate} onChange={(e) => setReserve({...reserve, reservationDate: e.target.value})}/>
                <br/>
                <br/>
                <label>Group size: </label>
                <input type='number' min='0'
                value={reserve.groupSize} onChange={(e) => setReserve({...reserve, groupSize: e.target.value})}/>
                <br/>
                <label>Phone number: </label>
                <input type='text' className='reserve-edit large' 
                value={reserve.customerPhone} onChange={(e) => setReserve({...reserve, customerPhone: e.target.value})}/>
                <br/>
                <label>Email: </label>
                <input type='text' className='reserve-edit large' 
                value={reserve.customerEmail} onChange={(e) => setReserve({...reserve, customerEmail: e.target.value})}/>
            </>}
            <br/>
            {!edit && <button className={accessibilityStyle(theme)} onClick={() => setEdit(!edit)}>Edit</button>}
            {edit && <button type="submit" className={'active'} onClick={() =>{ submitReserve(reserve); setEdit(false)}}>Submit</button>}
            {edit && <button className={accessibilityStyle(theme)} onClick={() => setEdit(false)}>Cancel</button>}
            {edit && <button className='red' onClick={() => deleteReserve(reserve)}>Delete</button>}
            </form>
        </div>
    )
}

function Reservation() {
    const [reservations, setReservations] = useState([]);

    useEffect(() => {
        const fetchReservationsStatus = async () => {
            const res = await fetch('/api/reservations');
            const data = await res.json();
            if (res.ok) {
                setReservations(data)
                console.log(data)
            }
        };
        fetchReservationsStatus();
    }, []) //empty array signifies that this function will only run once

    const patchReservation = async (reservation) => {
        const res = await fetch(`/api/reservations/${reservation._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservation)
        })
        const data = await res.json();
        if (res.ok) {
            console.log(data)
        }
    }

    const deleteReservation = async (reservation) => {
        setReservations(reservations.filter((d) => d._id !== reservation._id))
        const res = await fetch(`/api/reservations/${reservation._id}`, {
            method: 'DELETE',
        })
        const data = await res.json();
        if (res.ok) {
            console.log(data)
        }
    }
    
    const createReservation = async (reservation) => {
        const res = await fetch('/api/reservations', {
            method: 'POST',
            mode: 'cors', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservation),
        });
        //const data = await res.json();
        if (res.ok) {
            console.log("CREATED Reservation: ", reservation.title);
            console.log("WITH DATA: ", reservation);
            // need to get reservation info from response
            const data = await res.json();
            setReservations([...reservations, data]);
        } else {
            console.log("ERROR: ", res);
        }
    }

    const newReserve = {
        title: 'New reservation',
        groupSize: 0,
        reservationDate: new Date(),
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
            {/* adding Sidebar to Reservation */}
            <Sidebar>
                {/* Adding items in the sidebar here */}
                <SidebarItem icon={<Settings size={20} />} text="Settings" onPress={toggleThemeSelector} />
                <SidebarItem icon={<HelpCircle size={20} />} text="Help" onPress={toggleHelpMenu} />
            </Sidebar>
        </div>
        <div className='reservation-view-contents'>
            <h1>Reservation</h1>
            <div className='reservation-grid-view'>
                {reservations.map((reserve) => (
                    <ReservationCard
                        key={reserve._id} 
                        theme={theme}
                        reserve={reserve} 
                        setReserve={(newReserve) =>
                            {
                                setReservations(reservations.map((d) => (d._id === reserve._id ? newReserve : d)))
                            }
                        }
                        submitReserve={patchReservation}
                        deleteReserve={deleteReservation}
                    />
                ))}
                <div className='reserve-card'>
                        <button className='centered active' onClick={() => createReservation(newReserve)}>Create New Reservation</button>
                </div>
            </div>
        </div>
    </main>)
}

export default Reservation;