import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Catalog from './pages/Catalog/Catalog';

import NotificationToast from "./components/Schedule/NotificationToast.tsx";
import Profile from "./pages/Profile/Profile.tsx";
import Schedule from "./pages/Schedule/Schedule.tsx";


function App() {
    return (
        <Provider store={store}>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/catalog" element={<Catalog />} />
                        <Route path="/schedule" element={<Schedule />} />
                        <Route path="/profile" element={<Profile />} />

                    </Routes>
                    <NotificationToast />
                </Layout>
            </Router>
        </Provider>
    );
}

export default App;
