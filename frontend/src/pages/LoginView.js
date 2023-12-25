
import React from 'react';
import Sidebar, { SidebarItem } from '../components/sidebar';
import {
    Settings,
    HelpCircle,
} from "lucide-react"

function LoginView() {
    return (
    <main className='flex min-h-screen'> 
        {/* adding Sidebar to MapView */}
        <Sidebar>
            {/* Adding items in the sidebar here */}
            <SidebarItem icon={<Settings size={20} />} text="Settings" />
            <SidebarItem icon={<HelpCircle size={20} />} text="Help" />
        </Sidebar>
    </main>
    );
}

export default LoginView;
