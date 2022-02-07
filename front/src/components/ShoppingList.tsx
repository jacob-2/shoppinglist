import { useEffect, useState } from "react";
import { Item as ItemI } from "../api/items";
import Spinner from './Spinner';
import { ItemsAPI } from "../api/items";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, List, Stack, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import Item from './Item';


export default function ShoppingList() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [items, setItems] = useState<ItemI[]>([]);
  const [askDelete, setAskDelete] = useState<number|null>(null);

  const navigate = useNavigate();

  const setItem = (i: number) => (it: ItemI) => {
    setItems(its => {
      its = its.slice();
      console.log(its[i]);
      console.log(it);
      its[i] = it;
      return its;
    })
  };
  const askDeleteItem = (i: number) => () => {
    setAskDelete(i);
  }
  const confirmDelete = () => {
    if(askDelete==null) return;
    ItemsAPI.deleteItem(items[askDelete].id).then(r=> {
      if(!('error' in r)) setItems(its => {
        if(askDelete==null) return its;
        its = its.slice(0, askDelete).concat(its.slice(askDelete + 1));
        return its;
      });
    }).then(()=>setAskDelete(null));
  }

  useEffect(()=>{
    ItemsAPI.list().then(result => {
      if("error" in result)
        setError(result.error);
      else if('data' in result)
        setItems(result.data);
      setLoading(false);
    })
  },[]);
  
  return (
    error ? <ErrorMessage error={error} /> :
    loading || !items ? <Spinner /> :
    !items.length ? <EmptyList /> : 
    <>
      <Dialog
        open={askDelete != null}
        onClose={()=>setAskDelete(null)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{
          padding:'30px', paddingBottom:'10px', fontWeight:600
        }}>
            Delete Item?
        </DialogTitle>
        <DialogContent sx={{ width: '410px', paddingX: '30px' }}>
          <DialogContentText id="alert-dialog-description" variant='body2'>
            Are you sure you want to delete this item? This can not be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '30px'}}>
          <Button onClick={()=>setAskDelete(null)}>Cancel</Button>
          <Button variant='contained' onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Stack direction='row' sx={{ mt: '35px', justifyContent: 'space-between', alignItems:'end' }}>
        <Typography variant='h2'>Your Items</Typography>
        <Button variant='contained' onClick={()=>navigate('/new')}>Add Item</Button>
      </Stack>
      <List sx={{ padding: '0'}}>
        { items.map((it, i) =>
            <Item key={it.id} item={it} setItem={setItem(i)} deleteItem={askDeleteItem(i)} />)
        }
      </List>
    </>
  );
}

function EmptyList() {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        border: '1px solid #C6C6C6',
        m: '110px auto',
        textAlign: 'center',
      }} width={614} height={290} maxWidth='90%' borderRadius='5px'>
      <Typography color='#87898C' mt={'87px'}>
        Your shopping list is empty :(
      </Typography>
      <Button
        variant="contained"
        sx={{mt:'16px'}}
        onClick={()=>navigate('/new')}
      >Add your first item</Button>
    </Box>
  );
}

function ErrorMessage({error}: {error: string}) {
  return <div>
    {error}
  </div>;
}