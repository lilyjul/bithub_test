import { OrganizationIcon } from 'shared/assets/icons/OrganizationIcon'
import styles from './Navbar.module.scss'
import { AccountInfo } from 'shared/ui/AccountInfo/AccountInfo'

export const Navbar = () => {
	return (
		<div className={styles.navbar}>
			<div className={styles.leftSide}>
				<div className={styles.logo}>BitTest</div>
				<div className={styles.organization}>
					<OrganizationIcon />
					<p>Моя организация</p>
				</div>
			</div>
			<AccountInfo/>
		</div>
	)
}
