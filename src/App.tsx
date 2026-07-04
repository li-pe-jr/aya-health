import { Routes, Route, Navigate } from 'react-router-dom'
import { RootLayout } from '@/components/RootLayout'
import { AppLayout } from '@/components/AppLayout'
import { Welcome } from '@/screens/Welcome'
import { Onboarding } from '@/screens/onboarding/Onboarding'
import { Home } from '@/screens/Home'
import { Records } from '@/screens/Records'
import { Medications } from '@/screens/Medications'
import { Profile } from '@/screens/Profile'
import { SymptomFlowLayout } from '@/screens/symptoms/flow'
import { SymptomStep1 } from '@/screens/symptoms/SymptomStep1'
import { SymptomStep2 } from '@/screens/symptoms/SymptomStep2'
import { SymptomResult } from '@/screens/symptoms/SymptomResult'

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Welcome />} />
        <Route path="onboarding" element={<Onboarding />} />

        <Route element={<AppLayout />}>
          <Route path="home" element={<Home />} />
          <Route path="records" element={<Records />} />
          <Route path="medications" element={<Medications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="symptoms" element={<SymptomFlowLayout />}>
          <Route index element={<SymptomStep1 />} />
          <Route path="questions" element={<SymptomStep2 />} />
          <Route path="result" element={<SymptomResult />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
