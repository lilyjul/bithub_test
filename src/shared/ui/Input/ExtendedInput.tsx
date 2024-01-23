import { InputAdornment, OutlinedInput, TextField } from '@mui/material'
import './ExtendedInput.scss'
import ManageSearchIcon from '@mui/icons-material/ManageSearch'

interface PropsExtendedInput {
	getSearchQuery: (T: string)=>void
}

export const ExtendedInput = ({ getSearchQuery }: PropsExtendedInput) => {

	const search = (event: React.ChangeEvent<HTMLInputElement>) => {
		getSearchQuery(event.target.value)
	}
	
	return (
		<div>
			<OutlinedInput
				onChange={search}
				fullWidth={true}
				placeholder='Поиск'
				startAdornment={
					<InputAdornment position='start'>
						<ManageSearchIcon color='info' />
					</InputAdornment>
				}
			/>
		</div>
	)
}
