import React, { useState, useEffect, useRef } from 'react';
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
import MenuView from './MenuView';

// Color scheme for tables
const ColorScheme = {
    occupied: "#ADADFF",
    available: "#ADFFAD",
    reserved: "#FFF0AD",
    dirty: "#FFADAD",
    inEditMode: "white",
}

// Context buttons for the context menu
const ContextButton = ({ x=0, y=0, width=100, height=30, fontSize=20, text="Button", onClick={} }) => {
    const fillColor = 'lightgrey';
    const hoverFillColor = 'grey';
    const rectRef = useRef();
    return (
        <>
            <Rect
                ref = {rectRef}
                x={x}
                y={y}
                width={width}
                height={height}
                fill={fillColor}
                stroke={'black'}
                strokeWidth={2}
                cornerRadius={10}
                onClick={onClick}
                onMouseOver={() => {
                    rectRef.current.fill(hoverFillColor);
                }}
                onMouseOut={() => {
                    rectRef.current.fill(fillColor);
                }}
            />
            <Text
                text={text}
                x={x}
                y={y}
                width={width}
                height={height}
                listening={false}
                align={'center'}
                verticalAlign={'middle'}
                fontSize={fontSize}
            />
        </>
    );
}

// Context menu for tables
const TableContextMenu = ({ x, y, table, onAction={} }) => {
    const menuX = x || table.transform.x+table.transform.width+20;
    const menuY = y || table.transform.y;
    return (
        <>
            {/* Button to seat customers */}
            <ContextButton 
                x={menuX-5}
                y={menuY}
                width={160}
                height={30}
                text={(table.isOccupied ? "Clear Customers" : "Seat Customers")}
                onClick={() => {
                    var newTable = {...table};
                    newTable.isOccupied = !table.isOccupied;
                    if (newTable.isOccupied) { 
                        newTable.totalAssignedTimes += 1;
                        const numberOfPeople = parseInt(prompt("How many people are in the group?"));
                        if (!numberOfPeople || numberOfPeople < 0) {
                            return;
                        }
                        newTable.totalPeopleAssigned += numberOfPeople;
                        newTable.peopleAssigned = numberOfPeople;
                    }
                    if (!newTable.isOccupied) {
                        newTable.peopleAssigned = 0;
                    }
                    onAction(table, newTable);
                }}
            />
            {/* Button to reserve table */}
            <ContextButton 
                x={menuX-10} 
                y={menuY+35}
                width={170}
                height={30}
                text={"Mark " + (table.isReserved ? "Unreserved" : "Reserved")}
                onClick={() => {
                    var newTable = {...table};
                    newTable.isReserved = !table.isReserved;
                    onAction(table, newTable);
                }}
            />
            {/* Button to clean table */}
            <ContextButton 
                x={menuX} 
                y={menuY+35*2}
                width={150}
                height={30}
                text={"Mark " + (table.isClean ? "Dirty" : "Clean")}
                onClick={() => {
                    var newTable = {...table};
                    newTable.isClean = !table.isClean;
                    onAction(table, newTable);
                }}
            />
        </>
    );
}

// Table rectangle drawn on the map
const TableRect = ({ trRef, data, orders=[], dishes=[], sections=[], editable, onTableClicked={}, isSelected=false, ordersOnMap=false }) => {

    const [rectTransform, setRectTransform] = useState(data.transform || { x: 20, y: 20, width: 100, height: 100, rotation: 0 });
    const [fillColor, setFillColor] = useState('white');

    // Set the transform of the table to the one in the data
    useEffect(() => {
        console.log("SET DATA TRANSFORM: ", data);
        data.transform = rectTransform;
    }, [rectTransform]);

    // Update the colors of the table based on the data
    const updateColors = () => {
        if (editable) { 
            setFillColor(ColorScheme.inEditMode);
            return;
        }
        // Choose table color based on status
        if (data.isOccupied) {
            setFillColor(ColorScheme.occupied);
        } else if (data.isReserved) {
            setFillColor(ColorScheme.reserved);
        } else if (!data.isClean) {
            setFillColor(ColorScheme.dirty);
        } else {
            setFillColor(ColorScheme.available);
        }
    }

    useEffect(() => { 
        updateColors();
    }, [data, editable]);

    //data.transform = rectTransform;

    const [Shape, setShape] = useState(Rect);
  
    // On click, select the table
    const handleClick = (e) => {
        if (!rectRef || !trRef) {
            return;
        }
        if (!editable) {
            onTableClicked(data);
            return;
        }
        onTableClicked(data);
        // This allows us to select multiple rectangles using Shift
        // did we press shift or ctrl?
        var tr = trRef.current;
        const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
        const isSelected = tr.nodes().indexOf(rectRef.current) >= 0;
        if (!metaPressed && !isSelected) {
            // if no key pressed and the node is not selected
            // select just one
            tr.nodes([rectRef.current]);
          } else if (metaPressed && isSelected) {
            // if we pressed keys and node was selected
            // we need to remove it from selection:
            const nodes = tr.nodes().slice(); // use slice to have new copy of array
            // remove node from array
            nodes.splice(nodes.indexOf(rectRef.current), 1);
            tr.nodes(nodes);
          } else if (metaPressed && !isSelected) {
            // add the node into selection
            const nodes = tr.nodes().concat([rectRef.current]);
            tr.nodes(nodes);
          }
    };

    // When the table is transformed, update the data
    const handleTransform = () => {
        setRectTransform({ x: rectRef.current.x(), y: rectRef.current.y(), 
            width: rectRef.current.width() * rectRef.current.scaleX(), 
            height: rectRef.current.height() * rectRef.current.scaleY(), 
            rotation: rectRef.current.rotation() });
        rectRef.current.scaleX(1);
        rectRef.current.scaleY(1);
    }

    // When the table is moved, update the data
    const handleMovement = () => {
        setRectTransform({ x: rectRef.current.x(), y: rectRef.current.y(), 
            width: rectRef.current.width(), 
            height: rectRef.current.height(), 
            rotation: rectRef.current.rotation() });
    }

    // Are the table and order related, i.e. is the order on the table?
    const areConnected = (order, table) => {
        return order.tableID === table._id || table.orderArray.includes(order._id);
    }

    // Filter the orders to only the ones on the table
    const filterOrders = (orders, table) => {
        return orders && orders.filter((order) => areConnected(order, table)) || [];
    }

    // Get the orders text to display on the table
    const getOrdersText = () => {
        if (!data) { return "loading table...";}
        if (!orders) { return "loading orders...";}
        if (!dishes) { return "loading dishes...";}
        var myOrders = filterOrders(orders, data);
        if (myOrders.length === 0) {
            return "(no order)";
        }
        var allDishes = myOrders.map((order) => order.dishArray).flat();
        var allDishesNames = allDishes.map((dishID) => dishes.find((d) => d._id === dishID)).map((dish) => dish && dish.name || "[deleted dish]");
        if (allDishesNames.length === 0) {
            return "(empty order)";
        }
        return allDishesNames.join(", ");
    }

    var rectRef = useRef();
    var textRef = useRef();
  
    return (
      <>
        <Shape
            ref={rectRef}
            x={rectTransform.x}
            y={rectTransform.y}
            rotation={rectTransform.rotation}
            width={rectTransform.width}
            height={rectTransform.height}
            fill={fillColor}
            stroke={isSelected ? "red" : "black"}
            strokeWidth={isSelected ? 4 : 2}
            onClick={handleClick}
            draggable={editable}
            onDragStart={() => {
                //textRef.current.hide();
            }}
            onDragMove={() => {
                textRef.current.show();
                handleMovement();
            }}
            onDragEnd={() => {
                console.log("DRAG, x: ", rectTransform.x, " y: ", rectTransform.y);
                console.log("DATA: ", data);
            }}
            onTransformEnd={() => {
                handleTransform();
                console.log("TRANSFORM, width: ", rectTransform.width, " height: ", rectTransform.height);
            }}
        />
        <Text
            text={!ordersOnMap ? data.title : data.orderArray && getOrdersText()}
            ref={textRef}
            x={rectTransform.x}
            y={rectTransform.y}
            listening={false}
            rotation={rectTransform.rotation}
            width={rectTransform.width}
            height={rectTransform.height}
            align={!ordersOnMap ? 'center' : 'left'}
            verticalAlign={!ordersOnMap ? 'middle' : 'top'}
            fontSize={!ordersOnMap ? 25 : 16}
            padding={!ordersOnMap ? 0 : 5}
        />
        {data && sections && !ordersOnMap && <Text 
            text={(data.section ? sections.find((section) => section._id === data.section) && sections.find((section) => section._id === data.section).sectionTitle || "N/A" : "N/A") + ", " + (data.peopleAssigned||"0") + "/" + (data.seatsNumber||"0") + "s"}
            x={rectTransform.x}
            y={rectTransform.y}
            listening={false}
            rotation={rectTransform.rotation}
            width={rectTransform.width}
            height={rectTransform.height}
            align={'left'}
            verticalAlign={'bottom'}
            fontSize={16}
            padding={5}
        />}
      </>
    );
  };

// Info panel on the right side of the screen
const InfoPanel = ({table, orders, dishes, sections, toggleMenu=()=>{}, onSpecialNotesChanged=()=>{}, onDeleteOrder=()=>{}, onCreateOrder=()=>{}, onDeleteDish=()=>{}, onDataChanged=()=>{}, onDeleteTable=()=>{}, onCloneTable=()=>{}, onCreateSection=()=>{}, onPatchSection=()=>{}, onDeleteSection=()=>{}, editMode=false}) =>  {
    const [newTableName, setNewTableName] = useState(table && table.title || "");
    const [newSeatsNumber, setNewSeatsNumber] = useState(table && table.seatsNumber || 0);
    const [newSectionID, setNewSectionID] = useState(table && table.section || "");
    useEffect(() => {
        setNewTableName(table && table.title || "");
        setNewSeatsNumber(table && table.seatsNumber || 0);
    }, [table]);
    useEffect(() => {
        setNewSectionID(table && table.section || "");
    }, [table, sections]);

    const { theme } = useTheme();

    // Are the table and order related, i.e. is the order on the table?
    const areConnected = (order, table) => {
        return order.tableID === table._id || table.orderArray.includes(order._id);
    }

    return (
        <div className={`info_panel bg-${theme}-secondary transition duration-300`}>
            <h1 className={`text-${theme}-text transition duration-300`}>{table && ("Table: " + table.title) || "Info Panel - Select Table"}</h1>
            {!table && (<p className={`text-${theme}-text`}>Select a table to view its information</p>)}
            {table && (<>
            {!editMode && (<>
            {/* A bunch of information chips: Seat Number, Occupied, Reserved, Clean, People Assigned, Section */}
            {table && (table.seatsNumber>0 ? (<p className="chip blue">Seats: {table.seatsNumber}</p>) : (<p className="chip red">No seats</p>))}
            {table && (table.isOccupied ? (<p className="chip blue">Occupied</p>) : (<p className="chip green">Available</p>))}
            {table && (table.isReserved ? (<p className="chip yellow">Reserved</p>) : (<p className="chip green">Not Reserved</p>))}
            {table && (table.isClean ? (<p className="chip green">Clean</p>) : (<p className="chip red">Dirty</p>))}
            {table && (table.peopleAssigned > 0 ? (<p className="chip red">{table.peopleAssigned} people</p>) : (<p className="chip green">No people</p>))}
            {table && sections && (table.section ? (<p className="chip green">Section "{
                sections.find((section) => section._id === table.section) && sections.find((section) => section._id === table.section).sectionTitle || "?"}"</p>) : 
            (<p className="chip red">Not in section</p>))}

            {/* Order information - add dishes, delete dishes, delete order, add from menu, special notes */}
            <h2 className={`text-${theme}-text transition duration-300`}>Order</h2>
                {table && table.orderArray && orders && orders.filter((order) => areConnected(order, table)).map((order, index) => (<>
                    <h3 style={{fontSize:"16pt"}} className={`text-${theme}-text transition duration-300`} key={index}>{order.title} <button className="delete_button" onClick={() => {
                        onDeleteOrder(order);
                    }}> Delete order </button> </h3>
                    <ol>
                    {order.dishArray && dishes && order.dishArray
                    .map((dishID) => dishes.find((d) => d._id === dishID))
                    .map((dish, index) => (
                        <li className={`text-${theme}-text transition duration-300`} key={index}>{dish && dish.name || "[deleted dish]"} - ${dish && dish.price || "0"}<button className="delete_button" onClick={() => {
                            onDeleteDish(order, index);
                        }}> X </button> </li>
                    ))}
                    </ol>
                    <form onSubmit={(e) => {
                            e.preventDefault();
                        }} >
                        <button className="active" 
                        style={{marginTop:"10px"}}
                        onClick={() => {
                            toggleMenu(order);
                        }}> Add from menu </button>
                        <br/>
                        {(<textarea 
                            cols="50"
                            className={`text-${theme}-text transition duration-300`} key={index}
                            value={order.specialNotes}
                            placeholder="Special Notes"
                            onChange={(e) => {
                                var newOrder = {...order, specialNotes: e.target.value};
                                onSpecialNotesChanged(order, newOrder);
                            }}
                            />)}
                    </form>
                    </>
                ))}
                {table && orders && (!table.orderArray || table.orderArray.length === 0 || orders.filter((order) => areConnected(order, table)).length === 0)
                     && (<>
                    <p className={`text-${theme}-text transition duration-300`}>No orders</p>
                    <button className="active" 
                    style={{marginTop:"10px"}}
                    onClick={() => {
                        onCreateOrder(table);
                    }}> Create new order </button>
                    </>
                )}
            </>)}
            {/* Edit mode information - change table name, seats number, delete table, clone table */}
            {editMode && (<>
                <br/>
                <h2 className={`text-${theme}-text transition duration-300`}>Edit table</h2>
                <form onSubmit={(e) => {
                        e.preventDefault();
                        var newTable = {...table};
                        newTable.title = newTableName;
                        newTable.seatsNumber = newSeatsNumber;
                        newTable.section = newSectionID;
                        onDataChanged(table, newTable);
                }} >
                    <br/>
                    <label className={`text-${theme}-text transition duration-300`}>Table Name: </label>
                    <input 
                        value={newTableName}
                        onChange={(e) => setNewTableName(e.target.value)}
                        type="text" 
                        placeholder="Enter table name"
                        required
                    />
                    <br/>
                    <label className={`text-${theme}-text transition duration-300`}>Number of seats: </label>
                    <input
                        value={newSeatsNumber}
                        onChange={(e) => setNewSeatsNumber(e.target.value)}
                        type="number"
                        placeholder="Enter number of seats"
                        min="0"
                        max="100" 
                        required
                    />
                    <br/>
                    <label className={`text-${theme}-text transition duration-300`}>Choose section: </label>
                    {/* Dropdown with a list of sections */}
                    <select
                        value={newSectionID}
                        onChange={(e) => setNewSectionID(e.target.value)}
                        required
                    >
                        <option value="" disabled selected>Select a section</option>
                        {sections && sections.filter((section) => !section.isDeleted).map((section, index) => (
                            <option value={section._id} key={index}>{section.sectionTitle}</option>
                        ))}
                    </select>
                    <br/>
                    <br/>
                    <button className="active" type="submit" value="Submit">Save table</button>
                    <button className="red" onClick={() => { onDeleteTable(table); }}>Delete table</button>
                    <button onClick={() => { onCloneTable(table); }}>Clone table</button>
                </form>
            </>)}
            </>)}
            {/* If not selected table and in edit mode, show list of sections with editable inputs and create/delete buttons */}
            {!table && editMode && (<>
                <br/>
                <h2 className={`text-${theme}-text transition duration-300`}>Edit sections</h2>
                {sections && sections.map((section, index) => (<>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        var newSection = {...section};
                        newSection.sectionTitle = e.target[0].value;
                        onPatchSection(section, newSection);
                    }} >
                        {!section.isDeleted && <>
                        <input 
                            type="text"
                            placeholder="Enter section name"
                            defaultValue={section.sectionTitle}
                            required
                        />
                        <button className="active" type="submit" value="Submit">Save section</button>
                        <button className="red" onClick={() => { onDeleteSection(section); }}>X</button>
                        <p className={`text-${theme}-text transition duration-300 section_info`}>"{section.sectionTitle}" - Tables: {section.numberOfTable}, Seats: {section.totalNumberOfseats}</p>
                        </>}
                    </form>
                </>))}
                <br/>
                <h3 className={`text-${theme}-text transition duration-300`}>Create new section</h3>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    // Check if title is empty
                    if (!e.target[0].value) {
                        return;
                    }
                    // Blank section
                    var newSection = {
                        sectionTitle: e.target[0].value,
                        listOfTables: [],
                        numberOfTable: 0,
                        totalNumberOfseats: 0,
                        specialNotes: "",
                        isOpened: true,
                    }
                    onCreateSection(newSection);
                    // Reset the input
                    e.target[0].value = "";
                }} >
                    <input 
                        type="text"
                        placeholder="Enter section name"
                        required
                    />
                    <button className="active" type="submit" value="Submit">Create section</button>
                </form>
            </>)}
        </div>
    );
}

// Main map view
function MapView() {

    const trRef = useRef();
    const stageRef = useRef();

    // All the states used in the map view
    const [tables, setTables] = useState(null); //tables is an array of objects
    const [editMode, setEditMode] = useState(false);
    const [ordersOnMap, setOrdersOnMap] = useState(false);
    const [selectedTable, setSelectedTable] = useState(null);
    const [getHelpMenuActive, setHelpMenuActive] = useState(false);
    const [showThemeSelector, setShowThemeSelector] = useState(false);
    const { theme } = useTheme();
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuOrder, setMenuOrder] = useState(null);

    const [orders, setOrders] = useState(null);
    const [dishes, setDishes] = useState(null);
    const [sections, setSections] = useState(null);

    // When the app is loaded, fetch the tables from the database
    useEffect(() => {
        const fetchTablesStatus = async () => {
            const res = await fetch('/api/tables');
            const data = await res.json();
            if (res.ok) {
                setTables(data)
            }
        }
        fetchTablesStatus();
    }, []) //empty array signifies that this function will only run once

    // When the app is loaded, fetch the orders from the database
    useEffect(() => {
        const fetchOrdersStatus = async () => {
            const res = await fetch('/api/order');
            const data = await res.json();
            if (res.ok) {
                setOrders(data)
                console.log("Orders loaded: ", data)
            }
        }
        fetchOrdersStatus();
    }, []) //empty array signifies that this function will only run once

    // When the app is loaded, fetch the dishes from the database
    useEffect(() => {
        const fetchDishesStatus = async () => {
            const res = await fetch('/api/dish');
            const data = await res.json();
            if (res.ok) {
                setDishes(data)
                console.log("Dishes loaded: ", data)
            }
        }
        fetchDishesStatus();
    }, []) //empty array signifies that this function will only run once


    const fetchSectionsStatus = async () => {
        const res = await fetch('/api/section');
        const data = await res.json();
        if (res.ok) {
            setSections(data)
            console.log("Sections loaded: ", data)
        }
    }

    // When the app is loaded, fetch the sections from the database
    useEffect(() => {
        fetchSectionsStatus();
    }, []) //empty array signifies that this function will only run once
    // Section: sectionTitle, listOfTables, numberOfTable, totalNumberOfseats, specialNotes, isOpened

    useEffect(() => {
        if (!editMode) {
            // If we are not in edit mode, remove all transformers
            trRef.current.nodes([]);
        }
    }, [editMode])

    useEffect(() => {
        stageRef.current.on('click', function (e) {
            // if click on empty area - remove all transformers
            if (e.target === stageRef.current) {
                trRef.current.nodes([]);
                // also hide context menu
                setSelectedTable(null);
                return;
            }
        });
    });

    const saveLayout = () => {
        if (!tables) return;
        for (var table of tables) {
            patchTableDB(table);
        }
    }

    // Patches the table in the database, updating its status
    const patchTableDB = (table) => {
        const patchTablesStatus = async (table) => {
            const id = table._id;
            const res = await fetch('/api/tables/'+id, {
                method: 'PATCH',
                mode: 'cors', 
                headers: { 'Content-Type': 'application/json' }, // this is what was missing all this time
                body: JSON.stringify(table),
            });
            //const data = await res.json();
            if (res.ok) {
                console.log("PATCHED TABLE: ", table.title);
                console.log("WITH DATA: ", table);
                fetchSectionsStatus();
            } else {
                console.log("ERROR: ", res);
            }
        }
        patchTablesStatus(table);
    }  

    // Creates a new table in the database
    const createTableDB = (table) => {
        const createTablesStatus = async (table) => {
            const res = await fetch('/api/tables', {
                method: 'POST',
                mode: 'cors', 
                headers: { 'Content-Type': 'application/json' }, // this is what was missing all this time
                body: JSON.stringify(table),
            });
            //const data = await res.json();
            if (res.ok) {
                console.log("CREATED TABLE: ", table.title);
                console.log("WITH DATA: ", table);
                // need to get table info from response
                const data = await res.json();
                setTables([...tables, data]);
            } else {
                console.log("ERROR: ", res);
            }
        }
        createTablesStatus(table);
    }

    // Deletes a table from the database
    const deleteTableDB = (table) => {
        const deleteTablesStatus = async (table) => {
            const id = table._id;
            const res = await fetch('/api/tables/'+id, {
                method: 'DELETE',
                mode: 'cors', 
            });
            //const data = await res.json();
            if (res.ok) {
                console.log("DELETED TABLE: ", table.title);
                console.log("WITH DATA: ", table);
                fetchSectionsStatus();
            } else {
                console.log("ERROR: ", res);
            }
        }
        deleteTablesStatus(table);
    }

    const onDataChanged = (table) => {
        // Still need to setTables here to update everything
        patchTableDB(table);
        console.log("TABLE CHANGED: ", table);
    }

    // Patch the order in the database, updating its status
    const patchOrderDB = (order) => {
        const patchOrdersStatus = async (order) => {
            const id = order._id;
            const res = await fetch('/api/order/'+id, {
                method: 'PATCH',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' }, // this is what was missing all this time
                body: JSON.stringify(order),
            });
            //const data = await res.json();
            if (res.ok) {
                console.log("PATCHED ORDER: ", order.title);
                console.log("WITH DATA: ", order);
            } else {
                console.log("ERROR: ", res);
            }
        }
        patchOrdersStatus(order);
    }

    // Makes a blank order 
    const newOrder = (table) => {
        var order = { 
            title: "Order for "+table.title,
            creationDate: new Date(),
            dishArray: [],
            specialNotes: "",
            tableID: table._id,
        }
        return order;
    }
    
    // Creates a new order in the database
    const createOrderDB = (order) => {
        const createOrdersStatus = async (order) => {
            const res = await fetch('/api/order', {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' }, // this is what was missing all this time
                body: JSON.stringify(order),
            });
            //const data = await res.json(); 
            if (res.ok) {
                console.log("CREATED ORDER: ", order.title);
                // need to get order info from response
                const data = await res.json();
                console.log("NEW ORDER DATA: ", data);
                setOrders([...orders, data]);
            } else {
                console.log("ERROR: ", res);
            }
        }
        createOrdersStatus(order);
    }

    // Deletes an order from the database
    const deleteOrderDB = (order) => {
        setOrders(orders.filter((o) => o._id !== order._id));
        const deleteOrdersStatus = async (order) => {
            const id = order._id;
            const res = await fetch('/api/order/'+id, {
                method: 'DELETE',
                mode: 'cors',
            });
            //const data = await res.json();
            if (res.ok) {
                console.log("DELETED ORDER: ", order.title);
                console.log("WITH DATA: ", order);
            } else {
                console.log("ERROR: ", res);
            }
        }
        deleteOrdersStatus(order);
    }

    // Patches a section in the database, updating its status
    const patchSectionDB = (section) => {
        const patchSectionsStatus = async (section) => {
            const id = section._id;
            const res = await fetch('/api/section/'+id, {
                method: 'PATCH',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' }, // this is what was missing all this time
                body: JSON.stringify(section),
            });
            //const data = await res.json();
            if (res.ok) {
                console.log("PATCHED SECTION: ", section.sectionTitle);
                console.log("WITH DATA: ", section);
            } else {
                console.log("ERROR: ", res);
            }
        }
        patchSectionsStatus(section);
    }

    // Creates a new section in the database
    const createSectionDB = (section) => {
        const createSectionsStatus = async (section) => {
            const res = await fetch('/api/section', {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'application/json' }, // this is what was missing all this time
                body: JSON.stringify(section),
            });
            //const data = await res.json(); 
            if (res.ok) {
                console.log("CREATED SECTION: ", section.sectionTitle);
                // need to get section info from response
                const data = await res.json();
                console.log("NEW SECTION DATA: ", data);
                setSections([...sections, data]);
            } else {
                console.log("ERROR: ", res);
            }
        }
        createSectionsStatus(section);
    }

    // Deletes a section from the database
    const deleteSectionDB = (section) => {
        //setSections(sections.filter((o) => o._id !== section._id));
        // Mark section as "deleted"
        setSections(sections.map((s) => {
            if (s._id === section._id) {
                s.isDeleted = true;
            }
            return s;
        }));
        const deleteSectionsStatus = async (section) => {
            const id = section._id;
            const res = await fetch('/api/section/'+id, {
                method: 'DELETE',
                mode: 'cors',
            });
            //const data = await res.json();
            if (res.ok) {
                console.log("DELETED SECTION: ", section.sectionTitle);
                console.log("WITH DATA: ", section);
            } else {
                console.log("ERROR: ", res);
            }
        }
        deleteSectionsStatus(section);
    }
    
    // On table click, show info panel and context menu
    const onTableClicked = (table) => {
        if (selectedTable === table && !editMode) {
            setSelectedTable(null);
        } else {
            setMenuVisible(false);
            setSelectedTable(table);
        }
    }

    const blankTable = {
        title: "New Table",
        seatsNumber: 0,
        peopleAssigned: 0,
        isOccupied: false,
        isReserved: false,
        isClean: true,
        orderArray: [],
        customerID: null,
        totalPeopleAssigned: 0,
        totalAssignedTimes: 0,
        transform: { x: 20, y: 20, width: 100, height: 100, rotation: 0 }
    }

    // Make a blank table
    const createNewTable = () => {
        createTableDB(blankTable);
    }

    // Make a clone of a table
    const cloneTable = (table) => {
        var newTable = {...blankTable};
        // Only clone the position and the title/seat count
        newTable.title = table.title;
        newTable.seatsNumber = table.seatsNumber;
        newTable.transform = {...table.transform};
        newTable.transform.x += 20;
        newTable.transform.y += 20;
        newTable.section = table.section;
        createTableDB(newTable);
    }
    const toggleHelpMenu = () => {
        setHelpMenuActive(!getHelpMenuActive);
    }
    const toggleThemeSelector = () => {
        setShowThemeSelector(!showThemeSelector);
    };

    const accessibilityStyle = (theme) => {
        return `bg-${theme}-secondary text-${theme}-text  hover:bg-${theme}-primary transition duration-300`
    }

    // Automatic seating method
    const automaticSeating = () => {
        // First ask the user via prompt how many people are in the group
        const groupSize = parseInt(prompt("How many people are in the group?"));
        if (!groupSize || groupSize < 0) {
            return;
        }
        const seatCustomers = async (groupSize) => {
            const res = await fetch('/api/seating', {
                method: 'POST',
                mode: 'cors', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({groupSize: groupSize}),
            });
            const data = await res.json();
            if (res.ok) {
                console.log("SEATED TABLE: ", data);
                setTables(tables.map((t) => {
                    if (t._id === data._id) {
                        t = data;
                    }
                    return t;
                }))
                // Make the returned table the selected table 
                setSelectedTable(data);
            } else {
                console.log("ERROR: ", res);
                if (res.status === 404) {
                    alert(data.error);
                }
            }
        }
        seatCustomers(groupSize);
    }

    return (
    <main className='MapView'>
        <div className='flex min-h-screen fixed z-10'>
            {/* adding Sidebar to MapView */}
            <Sidebar>
                {/* Adding items in the sidebar here */}
                <SidebarItem icon={<Settings size={20} />} text="Settings" onPress={toggleThemeSelector} />
                <SidebarItem icon={<HelpCircle size={20} />} text="Help" onPress={toggleHelpMenu} />
            </Sidebar>
        </div>
        <HelpMenu isActive={getHelpMenuActive} />
        <ThemeSelector isHidden={!showThemeSelector} />
        <div className="buttons_div">
            {/* Buttons to toggle orders on map, edit mode, and create new table, as well as automatic seating */}
            <button
                className={accessibilityStyle(theme)}
                onClick={() => {
                    setOrdersOnMap(!ordersOnMap);
                }}>
                {ordersOnMap ? "Hide" : "Show"} Orders
            </button>
            <button 
                className={accessibilityStyle(theme) + ` ${editMode ? "active" : ""}`}
                onClick={() => {
                    if (!editMode) {
                        setSelectedTable(null);
                    }
                    setEditMode(!editMode);
                }}> 
                Edit Mode {editMode ? "On" : "Off"} 
            </button>
            {editMode && (<>
                <button className={accessibilityStyle(theme)} onClick={saveLayout}> Save Layout </button>
                <button className={accessibilityStyle(theme)} onClick={() => { createNewTable(); }}>Create new table </button>
            </>)}
            {/* button to seat a table via /seating route*/}
            <button className={accessibilityStyle(theme)} onClick={() => { automaticSeating(); }}>Automatic Seating</button>
        </div>
        {/* A Stage is a div from react-konva that allows us to draw tables on it */}
        <Stage
            y={50}
            className={`bg-${theme}-secondaryLight transition duration-300`}
            width={window.innerWidth} 
            height={window.innerHeight} 
            ref={stageRef} 
            draggable={true} 
            onWheel={(e) => {
                const scaleBy = 0.95;
                const stage = stageRef.current;
                // stop default scrolling
                e.evt.preventDefault();

                var oldScale = stage.scaleX();
                var pointer = stage.getPointerPosition();

                var mousePointTo = {
                x: (pointer.x - stage.x()) / oldScale,
                y: (pointer.y - stage.y()) / oldScale,
                };

                // how to scale? Zoom in? Or zoom out?
                let direction = e.evt.deltaY > 0 ? 1 : -1;

                // when we zoom on trackpad, e.evt.ctrlKey is true
                // in that case lets revert direction
                if (e.evt.ctrlKey) {
                direction = -direction;
                }

                var newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

                stage.scale({ x: newScale, y: newScale });

                var newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
                };
                stage.position(newPos);
            }}
        >
        <Layer>        
            { /* Draw all the tables on the map */
            tables && tables.map((table) => (
                <TableRect 
                    trRef={trRef} 
                    key={table._id} 
                    data={table} 
                    editable={editMode} 
                    onTableClicked={onTableClicked}
                    isSelected={selectedTable === table}
                    ordersOnMap={ordersOnMap}
                    orders={orders}
                    dishes={dishes}
                    sections={sections}
                />
            ))}
            {/* Transformer is a component from react-konva that allows us to transform tables */}
            <Transformer 
                ref={trRef} 
                keepRatio={false} 
                resizeEnabled={trRef.current && trRef.current.nodes().length < 2}
                rotationSnaps={[0, 45, 90, 135, 180, 225, 270, 315]}
            />
            { /* Draw the context menu for the selected table */
                selectedTable && !editMode &&
                <TableContextMenu 
                    table={selectedTable} 
                    onAction={(table, newTable) => {
                        setTables(tables.map((t) => {
                            if (t._id === table._id) {
                                t = newTable;
                            }
                            return t;
                        }))
                        setSelectedTable(newTable);
                        //setSelectedTable(null);
                        onDataChanged(newTable);
                    }} 
                />
            }
        </Layer>
        </Stage>
        {/* Info panel on the right side of the screen with many functions */}
        <InfoPanel 
            table={selectedTable} 
            orders={orders}
            dishes={dishes}
            sections={sections}
            editMode={editMode}
            toggleMenu={(order) => {
                setMenuOrder(order);
                setMenuVisible(!menuVisible);
            }}
            onSpecialNotesChanged={async (order, newOrder) => {
                await patchOrderDB(newOrder);
                setOrders(orders.map((o) => {
                    if (o._id === order._id) {
                        o = newOrder;
                    }
                    return o;
                }))
            }}
            onDeleteOrder={(order) => {
                deleteOrderDB(order);
                setTables(tables.map((t) => {
                    if (t.orderArray.includes(order._id)) {
                        t.orderArray = t.orderArray.filter((o) => o !== order._id);
                    }
                    return t;
                }));
                patchTableDB(selectedTable);
            }}
            onCreateOrder={(table) => {
                var newOrderI = newOrder(table);
                createOrderDB(newOrderI);
                setOrders([...orders, newOrderI]);
                setTables(tables.map((t) => {
                    if (t._id === table._id) {
                        t.orderArray.push(newOrderI._id);
                    }
                    return t;
                }))
                patchTableDB(table);
            }}
            onDataChanged={(table, newTable) => {
                setTables(tables.map((t) => {
                    if (t._id === table._id) {
                        t = newTable;
                    }
                    return t;
                }))
                setSelectedTable(newTable);
                onDataChanged(newTable);
            }}
            onDeleteTable={(table) => {
                setTables(tables.filter((t) => t._id !== table._id));
                setSelectedTable(null);
                trRef.current.nodes([]);
                deleteTableDB(table);
            }}
            onCloneTable={(table) => {
                cloneTable(table);
            }}
            onDeleteDish={(order, index) => {
                setOrders(orders.map((o) => {
                    if (o._id === order._id) {
                        o.dishArray.splice(index, 1);
                    }
                    return o;
                }
                ));
                patchOrderDB(order);
            }}
            onCreateSection={(section) => {
                createSectionDB(section);
            }}
            onDeleteSection={(section) => {
                deleteSectionDB(section);
            }}
            onPatchSection={(section, newSection) => {
                patchSectionDB(newSection);
                setSections(sections.map((s) => {
                    if (s._id === section._id) {
                        s = newSection;
                    }
                    return s;
                }))
            }}
        />
        {/* Menu view for adding dishes to an order */}
        {selectedTable && menuVisible && <MenuView 
            onClose={() => {setMenuVisible(false)}}
            preloadedDishes={dishes}
            orderMode={true}
            addToOrder={(dish) => {
                if (!menuOrder) return;
                setOrders(orders.map((o) => {
                    if (o._id === menuOrder._id) {
                        o.dishArray.push(dish._id);
                    }
                    return o;
                }
                ));
                patchOrderDB(menuOrder);
            }}
        />}
    </main>
    );
}

export default MapView;
