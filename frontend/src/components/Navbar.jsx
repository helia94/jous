// src/components/Navbar.js
import React, { useState, useEffect, Suspense, lazy, useCallback } from "react";
import { trackEvent } from "./analytics";
import { getCurrentUser } from "../login";
import { useLanguage } from "./LanguageContext";
import { Icon } from "./ui";
import "./NavbarCritical.css"; // Import critical CSS

// Lazy load the non-critical components
const ActivitiesModal = lazy(() => import("./ActivitiesModal"));
const CollapsedMenu = lazy(() => import("./CollapsedMenu"));
const FilterModal = lazy(() => import("./FilterModal"));
const NavbarItems = lazy(() => import("./NavbarItems"));

function Navbar() {
  const [user, setUser] = useState("noUser");
  const [activities, setActivities] = useState([]);
  const [checkedForActivities, setCheckedForActivities] = useState(false);
  const [openActivities, setOpenActivities] = useState(false);
  const [notify, setNotify] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const { language, openLanguageModal } = useLanguage();
  const token = localStorage.getItem("token");
  const [openFilterModal, setOpenFilterModal] = useState(false);

  // Function to load full CSS asynchronously
  const loadFullCSS = useCallback(() => {
    import("./NavbarFull.css");
  }, []);

  // Load full CSS after initial render
  useEffect(() => {
    loadFullCSS();
  }, [loadFullCSS]);

  useEffect(() => {
    if (!token) return;
    getCurrentUser()
      .then((r) => setUser(r))
      .catch((e) => console.error(e));
  }, [token]);

  useEffect(() => {
    if (!token || checkedForActivities) return;
    const fetchActivities = async () => {
      try {
        const Axios = (await import("axios")).default;
        const res = await Axios.get("/api/useractivities", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivities(res.data);
        setCheckedForActivities(true);
        setNotify(res.data.some((item) => !item.read));
      } catch (error) {
        console.error(error);
      }
    };
    fetchActivities();
  }, [token, checkedForActivities]);

  const setActivitiesToRead = useCallback(async () => {
    if (activities.length > 0) {
      try {
        const Axios = (await import("axios")).default;
        await Axios.get(`/api/readuseractivity/${activities[0].id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotify(false);
      } catch (error) {
        console.error(error);
      }
    }
  }, [activities, token]);

  const route = useCallback(
    (path) => {

      trackEvent({
        category: 'navigate',
        action: 'nav-button',
        label: path, 
      });

      window.location.href = `/${path}?lang=${language}`;
    },
    [language]
  );



  const checkCollapse = useCallback(() => {
    if (window.innerWidth < 700) {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
      setOpenMenu(false);
    }
  }, []);

  useEffect(() => {
    checkCollapse();
    window.addEventListener("resize", checkCollapse);
    return () => window.removeEventListener("resize", checkCollapse);
  }, [checkCollapse]);

  const navbarItems = (
    <Suspense fallback={null}>
      <NavbarItems
        notify={notify}
        token={token}
        route={route}
        user={user}
        openLanguageModal={openLanguageModal}
        setOpenFilterModal={setOpenFilterModal}
        setOpenActivities={setOpenActivities}
      />
    </Suspense>
  );

  return (
    <div className="navbar" style={{ position: 'relative', zIndex: 999, width:"100%" }} >
      <div className="brand" onClick={() => route("")}>
        Jous
      </div>
      <div className="menu-items">
        <button
          className="nav-button"
          onClick={() => route("random")}
          title="Random Questions"
        >
          <Icon name="random" />
        </button>

        {/* Conditionally render additional buttons on mobile */}
        {isCollapsed && (
          <>
            <button
              className="nav-button"
              onClick={openLanguageModal}
              title="Language"
            >
              <Icon name="language" />
            </button>
            <button
              className="nav-button"
              onClick={() => setOpenFilterModal(true)}
              title="Filter"
            >
              <Icon name="filter" />
            </button>
          </>
        )}

        {isCollapsed ? (
          <Suspense fallback={null}>
            <button
              className="nav-button"
              title="Menu"
              onClick={() => setOpenMenu(true)}
            >
              <Icon name="bars" />
            </button>
          </Suspense>
        ) : (
          navbarItems
        )}
      </div>

      {/* Lazy-loaded Modals */}
      <Suspense fallback={null}>
        <ActivitiesModal
          open={openActivities}
          onClose={() => setOpenActivities(false)}
          activities={activities}
          setActivitiesToRead={setActivitiesToRead}
          notify={notify}
        />
        <CollapsedMenu
          open={openMenu}
          onClose={() => setOpenMenu(false)}
          setOpenActivities={setOpenActivities}
          route={route}
          user={user}
          token={token}
          notify={notify}
          language={language}
          openLanguageModal={openLanguageModal}
          setOpenFilterModal={setOpenFilterModal}
        />
        <FilterModal
          open={openFilterModal}
          onClose={() => setOpenFilterModal(false)}
          languageId={language}
        />
      </Suspense>
    </div>
  );
}

export default React.memo(Navbar);
