import { Delete, Edit } from "@mui/icons-material";
import { Checkbox, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import { fontStyle } from "@mui/system";
import { useNavigate } from "react-router-dom";

import { Item as ItemI, ItemsAPI } from '../api/items';


export default function Item(
	{item:it, setItem, deleteItem}:
	{
		item: ItemI,
		setItem: (it:ItemI)=>void,
		deleteItem: ()=>void,
	}
) {
	const navigate = useNavigate();
	const togglePurchased = () => {
		ItemsAPI.updateItem({...it, purchased: !it.purchased })
			.then(r=>{
				if(!('error' in r))
					setItem({...it, purchased: !it.purchased});
			});
	}

	const lineThrough = { textDecoration: it.purchased ? 'line-through' : 'initial' };

	return <ListItem
		sx={{
			borderWidth: '0.5px',
			borderStyle: 'solid',
			borderColor: it.purchased ? 'rgba(213, 223, 233, 0)' : '#D5DFE9',
			padding: '0',
			my: '12px',
			mx: 'auto',
			maxWidth: '1025px',
			borderRadius: '4px',
			backgroundColor: it.purchased ? 'rgba(213, 223, 233, 0.17)' : 'initial',
		}}
		
		secondaryAction={
			<Stack direction='row'>
				<IconButton aria-label='edit' onClick={()=>navigate(`/edit/${it.id}`)}><Edit /></IconButton>
				<IconButton aria-label='delete' onClick={deleteItem}><Delete /></IconButton>
			</Stack>
		}
	>
		<ListItemButton onClick={togglePurchased}>
			<ListItemIcon>
				<Checkbox
					checked={it.purchased}
					tabIndex={-1}
					disableRipple
				/>
			</ListItemIcon>
			<ListItemText
				primary={<Typography variant="h3" color={it.purchased ? '#4D81B7' : 'initial'} sx={{...lineThrough}}>{it.title}</Typography>}
				secondary={<Typography variant='subtitle2' sx={{...lineThrough}}>{it.description}</Typography>}
			/>
		</ListItemButton>
	</ListItem>;
}