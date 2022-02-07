import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export default function Spinner() {
	return <Box sx={{textAlign:'center'}} mt='124px'>
		<CircularProgress
			sx={{
				margin:'auto auto',
			}}
			thickness={1}
			size={76}
			color='primary'
		/>
	</Box>;
}