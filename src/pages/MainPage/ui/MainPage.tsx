import { ExtendedInput } from 'shared/ui/Input/ExtendedInput'
import { ExtendedTable } from 'shared/ui/Table/ExtendedTable'
import { ExtendedDrawer } from 'widgets/Drawer/ui/ExtendedDrawer'
import { Pagination } from '@mui/material'
import styles from './MainPage.module.scss'
import React, { useEffect, useState } from 'react'


export const URL = 'https://test.gefara.xyz/api/v1/user/'

export interface HeadCell {
	id: string
	label: string
	numeric: boolean
	width?: string
	mobWidth?: string
}

export interface MappedData {
	id: string
	email?: string
	name?: string
	role?: string
	subscription?: string
	tokens?: string
	actions?: string
}

export interface UserInfo {
	id: string
	email: string
}

interface UserTable {
	id: string
	email: string
	tg_id: string | null
	name: string
	password: string | null
	avatar: string | null
	created_at: Date
	role: string
	subscription: {
		id: string
		plan_id: string
		user_id: string | null
		tokens: number
		additional_tokens: number
		created_at: Date
		plan: {
			id: string
			type: string
			price: number
			currency: string
			tokens: number
		}
	}
}

const tableHeaders: HeadCell[] = [
	{
		id: 'email',
		numeric: false,
		label: 'Email',
		width: '16.6%',
		mobWidth: '250px',
	},
	{
		id: 'name',
		numeric: false,
		label: 'Имя',
		width: '16.6%',
		mobWidth: '93px',
	},
	{
		id: 'role',
		numeric: true,
		label: 'Роль',
		width: '16.6%',
		mobWidth: '82px',
	},
	{
		id: 'subscription',
		numeric: false,
		label: 'Подписка',
		width: '16.6%',
		mobWidth: '74px',
	},
	{
		id: 'tokens',
		numeric: true,
		label: 'Токены',
		width: '16.6%',
		mobWidth: '120px',
	},
	{
		id: 'actions',
		numeric: false,
		label: 'Действия',
		width: '16.6%',
		mobWidth: '87px',
	},
]

const userDataMapper = (data: UserTable[]): MappedData[] => {
	return data.map((item: UserTable) => {
		return {
			id: item.id,
			email: item.email.toLowerCase(),
			name: item.name,
			role: item.role,
			subscription: item.subscription.plan.type,
			tokens: item.subscription.tokens + ' TKN',
			actions: item.id,
		}
	})
}

export const MainPage = () => {
	const [pagesCount, setPagesCount] = useState(0)
	const [currentPage, setCurrentPage] = useState(1)
	const [usersData, setUsersData] = useState(null)
	const [isDataLoaded, setIsDataLoaded] = useState(false)
	const [toggleDrawer, setToggleDrawer] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [user, setUser] = useState(null)

	const openDrawer = (user: UserInfo) => {
		setUser({ id: user.id, email: user.email })
		setToggleDrawer((prev: boolean) => !prev)
	}
	const handleChangePage = (
		event: React.ChangeEvent<unknown>,
		value: number
	) => {
		setCurrentPage(value)
	}

	const getSearchQuery = (queryStr: string) => {
		setSearchQuery(queryStr)
	}

	useEffect(() => {
		if (searchQuery) {
			fetch(`${URL}list?page=${currentPage}&search=${searchQuery}`)
				.then(res => res.json())
				.then(
					result => {
						const { data, pages } = result
						if (data && pages) {
							const mappedData = userDataMapper(data)
							setUsersData(mappedData)
							setIsDataLoaded(true)
							setPagesCount(+pages)
						}
					},
					error => {
						console.error(error)
					}
				)
		} else {
			fetch(`${URL}list?page=${currentPage}`)
				.then(res => res.json())
				.then(
					result => {
						const { data, pages } = result
						if (data && pages) {
							const mappedData = userDataMapper(data)
							setUsersData(mappedData)
							setIsDataLoaded(true)
							setPagesCount(+pages)
						}
					},
					error => {
						console.error(error)
					}
				)
		}
	}, [searchQuery])

	useEffect(() => {
		fetch(`${URL}list?page=${currentPage}`)
			.then(res => res.json())
			.then(
				result => {
					const { data, pages } = result
					if (data && pages) {
						const mappedData = userDataMapper(data)
						setUsersData(mappedData)
						setIsDataLoaded(true)
						setPagesCount(+pages)
					}
				},
				error => {
					console.error(error)
				}
			)
	}, [currentPage])

	return (
		<div className={styles.main}>
			<div className={styles.organization}>
				<h1>Моя организация</h1>
			</div>
			<div className={styles.container}>
				<h1>Пользователи</h1>
				<div className={styles.input}>
					<ExtendedInput getSearchQuery={getSearchQuery} />
				</div>
				{isDataLoaded && (
					<>
						<div className={styles.table}>
							<ExtendedTable
								usersData={usersData}
								tableHeaders={tableHeaders}
								onClickHandle={openDrawer}
							/>
						</div>
						<div className={styles.pagination}>
							<Pagination
								shape='rounded'
								count={pagesCount}
								onChange={handleChangePage}
							/>
						</div>
					</>
				)}
			</div>
			{user && (
				<ExtendedDrawer
					user={user}
					open={toggleDrawer}
					openDrawer={openDrawer}
				/>
			)}
		</div>
	)
}
