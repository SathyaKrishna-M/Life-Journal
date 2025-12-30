import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Ownership from './pages/Ownership';
import VisionBoard from './pages/VisionBoard';
import Goals from './pages/Goals';
import YearlyCalendar from './pages/Calendar';
import MonthlyPlanner from './pages/Monthly';
import WeeklyPlanner from './pages/Weekly';
import DailyPlanner from './pages/Daily';
import Reflection from './pages/Reflection';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Ownership />} />
          <Route path="/vision" element={<VisionBoard />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/calendar" element={<YearlyCalendar />} />
          <Route path="/monthly" element={<MonthlyPlanner />} />
          <Route path="/weekly" element={<WeeklyPlanner />} />
          <Route path="/daily" element={<DailyPlanner />} />
          <Route path="/reflection" element={<Reflection />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
