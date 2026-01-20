import './App.css'
import Home from './components/Home'
import CustomerData from './components/CustomerData'
import AddCustomer from './components/AddCustomer'
import {Routes, Route } from 'react-router-dom'
import IndividualCustomer from './components/IndividualCustomer'
import EditCustomer from './components/EditCustomer'

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/customers" element={<CustomerData/>} />
      <Route path="/add_customer" element={<AddCustomer/>}/>
      <Route path="/customer/:id" element={<IndividualCustomer/>}/>
      <Route path="/edit_customer/:id" element={<EditCustomer/>}/>
    </Routes>
    </>
  )
}

export default App
