import './styles/index.scss'
import { Navbar } from 'widgets/Navbar'
import { MainPage } from 'pages/MainPage'

function App() {
	return (
		<div className='app'>
			<Navbar />
			<MainPage />
		</div>
	)
}

export default App
