// src/frontend/components/ScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component will automatically scroll the window to the top
// every time the route (URL path) changes.
const ScrollToTop = () => {
    // Extracts the pathname property from the location object
    const { pathname } = useLocation();

    // useEffect hook will run every time the pathname changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]); // The effect depends on the pathname, so it runs on each route change

    return null; // This component does not render anything to the screen
};

export default ScrollToTop;