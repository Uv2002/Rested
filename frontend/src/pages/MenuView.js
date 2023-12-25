import React, { useState, useEffect, useRef } from 'react';
// import { render } from 'react-dom';
import { Stage, Layer, Rect, Text, Transformer } from 'react-konva';
import './MapView.css';
import Sidebar, { SidebarItem } from '../components/sidebar';
import ThemeSelector from '../components/ThemeSelector';
import {useTheme} from '../context/ThemeContext';
import {
    Settings,
    HelpCircle,
} from "lucide-react"
import HelpMenu from '../components/HelpMenu';

// Dish card contains the dish name, price, and description of a single dish
const DishCard = ({theme, dish, setDish, submitDish, deleteDish, orderMode=false, orderDish=()=>{}}) => {
    const [edit, setEdit] = useState(false);
    const [dishName, setDishName] = useState(dish.name);
    const [dishPrice, setDishPrice] = useState(dish.price);
    const [dishDescription, setDishDescription] = useState(dish.description);

    // Update dishName, dishPrice, and dishDescription when dish changes
    useEffect(() => {
        setDishName(dish.name);
        setDishPrice(dish.price);
        setDishDescription(dish.description);
    }, [dish])

    const accessibilityStyle = (theme) => {
        return `bg-${theme}-secondary text-${theme}-text  hover:bg-${theme}-primary transition duration-300`
    }

    return (
        <div className='dish-card'>
            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    setDish({...dish, name: dishName, price: dishPrice, description: dishDescription});
                    submitDish({...dish, name: dishName, price: dishPrice, description: dishDescription});
                    setEdit(false);
                }}
            >
            {!edit && <>
                <h2>{dish.name} - ${dish.price}</h2>
                <p style={{marginBottom: '10px'}}>
                    {dish.description}</p>
            </>}
            {/* Dish info: name, price, description */}
            {edit && <>
                <label>Dish name: </label>
                <input 
                    type='text'
                    className='menu-edit large' 
                    placeholder='Dish name'
                    value={dishName} 
                    onChange={(e) => setDishName(e.target.value)}
                    required
                />
                <br/>
                <label>Price ($): </label>
                <input 
                    type='number'
                    min="0"
                    required
                    placeholder='0'
                    className='menu-edit large' 
                    value={dishPrice} 
                    onChange={(e) => setDishPrice(e.target.value)}
                />
                <br/>
                <label>Description: </label>
                <textarea 
                    rows='3' 
                    cols='30'
                    placeholder='This dish is...'
                    className='menu-edit' 
                    value={dishDescription} 
                    onChange={(e) => setDishDescription(e.target.value)}
                />
                <br/>
            </>}
            
            {/* Buttons: Edit, Submit, Cancel, Delete */}
            {!edit && !orderMode && <button className={accessibilityStyle(theme)} onClick={() => setEdit(!edit)}>Edit</button>}
            {edit && <button type="submit" className={'active'}>Submit</button>}
            {edit && <button className={accessibilityStyle(theme)} onClick={(e) => {e.stopPropagation(); setEdit(false)}}>Cancel</button>}
            {edit && <button className='red' onClick={(e) => {e.stopPropagation(); deleteDish(dish)}}>Delete</button>}
            
            {orderMode && <button className={accessibilityStyle(theme)} onClick={(e) => {e.stopPropagation(); orderDish(dish)}}>Add</button>}
            </form>
        </div>
    )
}

// Menu view contains a grid of DishCards
const MenuView = ({preloadedDishes, orderMode=false, addToOrder=()=>{}, onClose=()=>{}}) => {

    const [dishes, setDishes] = useState(preloadedDishes || []);

    // Fetch dishes from database
    useEffect(() => {
        const fetchDishes = async () => {
            const res = await fetch('/api/dish');
            const data = await res.json();
            if (res.ok) {
                setDishes(data)
                console.log(data)
            }
        }
        if (!preloadedDishes) {
            fetchDishes();
        }
    }, []) //empty array signifies that this function will only run once

    // Update dish in database
    const patchDish = async (dish) => {
        const res = await fetch(`/api/dish/${dish._id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dish)
        })
        const data = await res.json();
        if (res.ok) {
            console.log(data)
        }
    }

    // Delete dish from database
    const deleteDish = async (dish) => {
        console.log("deleting dish " + dish._id)
        const res = await fetch(`/api/dish/${dish._id}`, {
            method: 'DELETE',
            mode: 'cors', 
        })
        const data = await res.json();
        if (res.ok) {
            console.log(data)
            setDishes(dishes.filter((d) => d._id !== dish._id))
        }
    }
    
    // Create dish in database
    const createDish = async (dish) => {
        const res = await fetch(`/api/dish/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dish)
        })
        const data = await res.json();
        if (res.ok) {
            console.log(data)
            setDishes([...dishes, data])
        }
    }

    // Blank dish for creating new dish
    const newDish = {
        name: 'New Dish',
        price: 10,
        description: '',
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
    const accessibilityStyle = (theme) => {
        return `bg-${theme}-secondary text-${theme}-text  hover:bg-${theme}-primary transition duration-300`
    }

    return (
    <main className='MenuView'>
        {!orderMode && <div className='flex min-h-screen fixed z-10'>
            {/* adding Sidebar to MapView */}
            <Sidebar>
                {/* Adding items in the sidebar here */}
                <SidebarItem icon={<Settings size={20} />} text="Settings" onPress={toggleThemeSelector} />
                <SidebarItem icon={<HelpCircle size={20} />} text="Help" onPress={toggleHelpMenu} />
            </Sidebar>
        </div>}
        {/* Based on whether the menu is the main thing on the screen or not, the menu will be displayed differently */}
        <div className={((!orderMode && 'menu-view-contents') || 'menu-view-contents-concise' + ` bg-${theme}-secondary transition duration-300`)}>
            <h1 className={orderMode && `text-${theme}-text transition duration-300` || ''}>Restaurant Menu</h1>
            {orderMode && <button className='close-button red' onClick={onClose}>X</button>}
            <div className='dish-grid-view'>
                {/* Add all dishes to the grid in a loop */}
                {dishes.map((dish) => (
                    <DishCard 
                        theme={theme}
                        dish={dish} 
                        setDish={(newDish) =>
                            {
                                setDishes(dishes.map((d) => (d._id === dish._id ? newDish : d)))
                            }
                        }
                        submitDish={patchDish}
                        deleteDish={deleteDish}
                        orderMode={orderMode}
                        orderDish={() => addToOrder(dish)}
                    />
                ))}
                {!orderMode && <div className='dish-card'>
                        <button className='centered active' onClick={() => createDish(newDish)}>Create New Dish</button>
                </div>}
            </div>
        </div>
    </main>)
}

export default MenuView;
