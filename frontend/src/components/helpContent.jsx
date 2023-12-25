// helpContent.js

const helpContent = {
  "How to Mark Tables": `
    <div class="container mx-auto p-4">
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 class="block text-gray-700 text-xl font-bold mb-2">Marking Tables</h2>
            <p class="text-gray-700 text-base mb-4">
                Marking tables visually in our system is an efficient way to track
                the status of each table in your restaurant. Here's how it works:
            </p>
            <ul class="list-disc pl-5 mb-4">
                <li>In the default view, click on a table to bring up its status
                    menu.</li>
                <li>You will see three buttons beside the table: <strong>Mark
                        Occupied</strong>, <strong>Mark Reserved</strong>, and
                    <strong>Mark Dirty</strong>.</li>
                <li>Clicking on these buttons will change the table's state and the
                    color of the table's rectangle representation on the system.</li>
            </ul>
            <div class="mb-4">
                <p class="text-gray-700 text-base mb-2">Table State Colors:</p>
                <ul class="list-disc pl-5">
                    <li><span class="text-green-500 font-bold">Green:</span>
                        Available, Not Reserved, and Clean</li>
                    <li><span class="text-red-500 font-bold">Red:</span> Dirty</li>
                    <li><span class="text-yellow-500 font-bold">Yellow:</span>
                        Reserved</li>
                    <li><span class="text-blue-500 font-bold">Blue:</span> Occupied</li>
                </ul>
            </div>
            <img src="./Marking-tables.gif" alt="Table marking illustration"
                class="w-full h-auto" />
        </div>
    </div>
    `,
  "How to Take Orders": `
    <div class="container mx-auto p-4">
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 class="block text-gray-700 text-xl font-bold mb-2">Taking Orders</h2>
            <p class="text-gray-700 text-base mb-4">
                Taking orders is a straightforward process in our system. Follow
                these steps to efficiently manage customer orders:
            </p>
            <ul class="list-disc pl-5 mb-4">
                <li>Click on a table on the map to associate an order with that
                    specific table.</li>
                <li>The menu for the selected table, along with all its information,
                    will appear in the right column of the app.</li>
                <li>In this area, you can view the current state of the table.</li>
                <li>Use the textbox provided to input each item of the order.</li>
                <li>If the order needs to be modified, you can remove items
                    individually by clicking the 'x' next to each order in the list.</li>
            </ul>
            <img src="./Taking-orders.gif"
                alt="Order taking illustration" class="w-full h-auto" />
        </div>
    </div>
    `,
    "How to View Orders": `
    <div class="container mx-auto p-4">
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 class="block text-gray-700 text-xl font-bold mb-2">Viewing Orders</h2>
            <p class="text-gray-700 text-base mb-4">
                Viewing orders is easy and can be done in three main ways:
            </p>
            <ul class="list-disc pl-5 mb-4">
                <li><strong>Directly from the Table:</strong> Click a table on the map view to see its associated order list in the right column.</li>
                <li><strong>Show Orders Button:</strong> Click the "Show Orders" button near the top of the application. This will display the orders on the rectangles representing tables.</li>
                <li><strong>Orders View:</strong> Navigate to the orders view to see all orders in one place. This view is especially designed for chefs and cooks for better organization and efficiency.</li>
            </ul>
            <img src="./Show-orders.gif" alt="Orders view illustration" class="w-full h-auto"/>
        </div>
    </div>
    `,
    "How to Edit Map": `
    <div class="container mx-auto p-4">
        <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 class="block text-gray-700 text-xl font-bold mb-2">Editing the Map</h2>
            <p class="text-gray-700 text-base mb-4">
                Editing the map layout is straightforward. Follow these steps to customize your restaurant's table arrangement:
            </p>
            <ul class="list-disc pl-5 mb-4">
                <li>Activate <strong>Edit Mode</strong> by clicking the "Edit Mode Off" button near the top of the screen. The map view will switch to edit mode.</li>
                <li>Select any rectangle (table) to transform it. Drag the sides to adjust width/height.</li>
                <li>To reposition a table, click and drag it to a new location.</li>
                <li>Rotate the table by clicking and dragging the top point.</li>
                <li>Additional options, like <strong>Delete Table</strong>, cloning, and other properties, are available in the right column.</li>
                <li>Use the <strong>Clone</strong> button to duplicate a table with all its properties.</li>
                <li>A new button at the top of the screen allows you to add a new table to the map.</li>
                <li>When you are finished editing, click the "<strong>Save Layout</strong>" button and switch back to the default view by exiting the edit mode.</li>
            </ul>
            <img src="./Edit-map.gif" alt="Map editing illustration" class="w-full h-auto"/>
        </div>
    </div>
    `,
  // ... more topics
};

export default helpContent;
