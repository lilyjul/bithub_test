import { CloseSharp } from '@mui/icons-material'
import { Drawer } from '@mui/material'
import styles from './ExtendedDrawer.module.scss'
import { useEffect, useState } from 'react'
import { ExtendedTable } from 'shared/ui/Table/ExtendedTable'
import dayjs from 'dayjs'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { LineChart } from '@mui/x-charts/LineChart'
import { HeadCell, MappedData, URL, UserInfo } from 'pages/MainPage/ui/MainPage'

const tableHeaders: HeadCell[] = [
	{
		id: 'type',
		numeric: false,
		label: 'Тип',
	},
	{
		id: 'amount',
		numeric: false,
		label: 'Сумма',
	},
	{
		id: 'date',
		numeric: false,
		label: 'Дата',
	},
]

interface UserTableTransaction {
	id: 'string'
	provider: string
	currency: string
	meta: {} | null
	amount: number
	status: string
	type: string
	plan_id: string
	user_id: string
	referral_id: string
	external_id: string
	created_at: Date
}

interface PropsExtendedDrawer {
	openDrawer: (T: UserInfo) => void
	open: boolean
	user: UserInfo
}

interface UserTransaction {
	id: string
	type: string
	amount: string
	date: string
}

export const ExtendedDrawer: React.FC<PropsExtendedDrawer> = ({
	openDrawer,
	open,
	user,
}) => {
	const userDataMapper = (data: UserTableTransaction[]): MappedData[] => {
		return data.map((item: UserTableTransaction) => {
			const amount =
				item.type === 'REPLENISH'
					? `+${item.amount} BTKN`
					: `-${item.amount} BTKN`
			const type =
				item.type === 'REPLENISH'
					? item.status === 'SUCCEDED'
						? 'Пополнение'
						: 'Пополнение*'
					: item.status === 'PENDING'
					? 'Списание'
					: 'Списание*'
			const date = dayjs(item.created_at).format('DD.MM.YY, HH:mm:ss')

			return {
				id: item.id,
				type,
				amount,
				date,
			}
		})
	}

	const [userData, setUserData] = useState([])
	const [dataLoaded, setDataLoaded] = useState(false)
	const [dateInterval, setDateInterval] = useState([])
	const [replenishTransactions, setReplenishTransactions] = useState([])
	const [writeOffTransactions, setWriteOffTransactions] = useState([])

	const toggleDrawer = () => {
		openDrawer(user)
	}

	useEffect(() => {
		if (user.id) {
			fetch(`${URL}${user.id}/transactions`)
				.then(res => res.json())
				.then(
					result => {
						setUserData(userDataMapper(result))
						setDateInterval(
							result
								.filter((i: UserTableTransaction) => i.status === 'SUCCEDED')
								.map((i: UserTableTransaction) => new Date(i.created_at))
						)
						setReplenishTransactions(
							result
								.filter((i: UserTableTransaction) => i.status === 'SUCCEDED')
								.map((i: UserTableTransaction) =>
									i.type === 'REPLENISH' ? +i.amount : null
								)
						)
						setWriteOffTransactions(
							result
								.filter((i: UserTableTransaction) => i.status === 'SUCCEDED')
								.map((i: UserTableTransaction) =>
									i.type === 'WRITE_OFF' ? +i.amount : null
								)
						)
						setDataLoaded(true)
					},
					error => {
						console.error(error)
					}
				)
		}
	}, [open])

	const dayjsFormat = (date: Date) => {
		return dayjs(date).format('DD-MMM-YY HH:MM')
	}

	const darkTheme = createTheme({
		palette: {
			mode: 'dark',
		},
	})

	return (
		<Drawer anchor='right' open={open}>
			<div className={styles.drawer}>
				{dataLoaded && (
					<>
						<div className={styles.header}>
							<p>{user.email?.toLowerCase()}</p>
							<div className={styles.closeIcon}>
								<CloseSharp
									fontSize='medium'
									color='info'
									className={styles.closeBtn}
									onClick={toggleDrawer}
								/>
							</div>
						</div>
						<p>Использование токенов</p>
						<ThemeProvider theme={darkTheme}>
							<LineChart
								leftAxis={null}
								rightAxis={'DEFAULT_Y_AXIS_KEY'}
								series={[
									{
										data: replenishTransactions,
										type: 'line',
										color: '#59a14f',
										showMark: false,
										label: 'Пополнение',
									},
									{
										data: writeOffTransactions,
										type: 'line',
										color: '#ff9da7',
										showMark: false,
										label: 'Списание',
									},
								]}
								xAxis={[
									{
										data: dateInterval,
										scaleType: 'time',
										valueFormatter: dayjsFormat,
									},
								]}
								height={285}
							/>
						</ThemeProvider>
						<p className={styles.divider}></p>
						<p>История транзакций</p>
						<ExtendedTable tableHeaders={tableHeaders} usersData={userData} />
					</>
				)}
			</div>
		</Drawer>
	)
}
