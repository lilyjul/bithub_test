import styles from './AccountInfo.module.scss'
import { Avatar } from '@mui/material'

export const AccountInfo = () => {
	return (
		<div className={styles.card}>
			<Avatar className={styles.avatar} sx={{ width: 32, height: 32 }} />
			<div className={styles.info}>
				<span>Вы авторизованы</span>
				<p>Администратор</p>
			</div>
		</div>
	)
}
