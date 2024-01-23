import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material'

import BorderColorIcon from '@mui/icons-material/BorderColor'
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp'
import { useEffect, useState } from 'react'
import './ExtendedTable.scss'
import { HeadCell, MappedData, UserInfo } from 'pages/MainPage/ui/MainPage'


interface PropsExtendedTable {
	onClickHandle?: (T: UserInfo) => void
	tableHeaders: HeadCell[]
	usersData: MappedData[]
}

export const ExtendedTable: React.FC<PropsExtendedTable> = ({
	usersData,
	tableHeaders,
	onClickHandle,
}) => {

	const getUser = (value: UserInfo) => {
		onClickHandle(value)
	}

	const [mobScreen, setMobScreen] = useState(false)

	const getMobAdapt = () => {
		window.innerWidth <= 375 ? setMobScreen(true) : setMobScreen(false)
	}

	useEffect(() => {
		addEventListener('resize', getMobAdapt)

		return () => removeEventListener('resize', getMobAdapt)
	}, [mobScreen])

	const clickHandler = (user: UserInfo) => {
		if (onClickHandle) {
			getUser({ id: user.id, email: user.email })
		} else {
			return
		}
	}

	return (
		<div>
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							{tableHeaders.map((header: HeadCell) => {
								return (
									<TableCell
										key={header.id}
										align='center'
										style={{
											width: mobScreen ? header.mobWidth : header.width,
										}}
									>
										{header.label}
									</TableCell>
								)
							})}
						</TableRow>
					</TableHead>

					<TableBody>
						{usersData.map((row: MappedData) => {
							return (
								<TableRow
									key={row.id}
									onClick={() => clickHandler({ id: row.id, email: row.email })}
								>
									{tableHeaders.map((column: HeadCell) => {
										const value = row[column.id as keyof typeof row]
										const data =
											column.id === 'actions' ? (
												<div className='user-table-action-btn'>
													<BorderColorIcon fontSize='inherit' color='info' />
													<DeleteSharpIcon fontSize='inherit' color='info' />
												</div>
											) : (
												value
											)
										const style = {
											color: value.startsWith('+')
												? 'green'
												: value.startsWith('-')
												? 'red'
												: 'white',
										}
										return (
											<TableCell
												align='center'
												key={column.id + row.id}
												style={style}
											>
												{data}
											</TableCell>
										)
									})}
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	)
}
