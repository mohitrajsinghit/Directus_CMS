import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchMenuSections, fetchMenuItems } from "../api/directus";
import "./Sidebar.css";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [openSections, setOpenSections] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        
        // Fetch all menu sections
        const sections = await fetchMenuSections();
        
        // For each section, fetch its menu items
        const sectionsWithItems = await Promise.all(
          sections.map(async (section) => {
            const items = await fetchMenuItems(section.id);
            return {
              ...section,
              items: items.map(item => ({
                id: item.id,
                title: item.title,
                path: item.path || `/${item.title.replace(/\s+/g, "").toLowerCase()}`
              }))
            };
          })
        );
        
        setMenuItems(sectionsWithItems);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching menu:", error);
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button
          className="collapse-button"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? "→" : "X"}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <h2 className="sidebar-title">DASHBOARD</h2>
          {loading ? (
            <div className="loading-indicator">Loading menu...</div>
          ) : (
            <ul className="menu-list">
              {menuItems.map((section) => (
                <li key={section.id} className="menu-item">
                  <button
                    className="section-button"
                    onClick={() => toggleSection(section.title)}
                  >
                    <span>{section.title}</span>
                    <span>{openSections[section.title] ? "-" : "+"}</span>
                  </button>
                  {openSections[section.title] && (
                    <ul className="submenu-list">
                      {section.items.map((item) => (
                        <li key={item.id} className="submenu-item">
                          <Link to={item.path}>
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default Sidebar;
