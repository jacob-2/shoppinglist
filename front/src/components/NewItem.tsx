import { LastPage } from "@mui/icons-material";
import { Autocomplete, Box, Button, Drawer, IconButton, InputAdornment, MenuItem, Select, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemsAPI, NewItem as Item } from "../api/items";


interface Props {
  open: boolean;
  callback: ()=>void;
}
export default function NewItem({open, callback}:Props) {
  const navigate = useNavigate();

  const [item, setItem] = useState<Item>({
    title:'', description:'', quantity:0, purchased:false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [inputErrors, setInputErrors] = useState<{title?:boolean}>({});

  // Enables "quick-hiding" when creating an item (no sliding animation)
  const [hidden, setHidden] = useState(false);
  useEffect(()=>{
    if(open) setHidden(false);
  }, [open]);

  const clear = () => {
    setItem({ title: '', description: '', quantity: 0, purchased: false });
    setError('');
    setInputErrors({});
  }

  const validate = () => {
    if (!item.title) {
      setInputErrors(errs=>({...errs, title: true}));
      return false;
    }
    return true;
  }

  useEffect(()=>{
    setInputErrors({});
  }, [item]);

  useEffect(()=>{
    if(!!error) {
      // TODO: better error handling
      alert(error);
      window.location.reload();
    }
  }, [error]);

  const submit = ()=>{
    if (submitting) return;
    if (!validate()) return;
    setSubmitting(true);
    ItemsAPI.newItem(item).then(r=>{
      setSubmitting(false);
      if(r && 'error' in r) setError(r.error);
      else {
        navigate('/');
        setHidden(true);
        callback();
        clear();
      }
    })
  };

  return (
    <Drawer
      anchor='right'
      open={open}
      sx={{maxWidth:'90%', display: hidden && !open ? 'none':'initial'}}
    >
      <Toolbar
        sx={{
          backgroundColor: theme=>theme.palette.grey[50],
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: theme=>theme.palette.grey[200],
        }}
      >
        <Typography variant="h1" sx={{ flexGrow: 1 }}>
          SHOPPING LIST
        </Typography>
        <IconButton aria-label='close' onClick={()=>navigate(-1)}>
          <LastPage />
        </IconButton>
      </Toolbar>
      <Box
        flexGrow={1}
        sx={{
          padding: '30px',
          width: '560px',
          maxWidth: '90vw',
        }}
      >
        <Typography variant="h2">Add an Item</Typography>
        <Typography variant="subtitle1">Add your new item below</Typography>
        <Stack component='form' autoComplete="off" spacing={2} alignItems='stretch' sx={{my:'13px'}}>
        <TextField placeholder='Item Name' value={item.title}
            error={!!inputErrors.title}
            onChange={e => 
              (v => setItem(it => ({ ...it, title: v })))
                (e.currentTarget.value)
            }
        />
        <TextField placeholder='Description' multiline rows={4}
          inputProps={{ maxLength: 100 }}
          InputProps={{
            endAdornment: <InputAdornment position='end' sx={{alignSelf: 'flex-end', width: 0}}>
                <Typography variant='caption' sx={{width:'60px', textAlign:'right', ml:'-60px'}}>
                  {`${item.description.length}/100`}
                </Typography>
              </InputAdornment>,
          }}
          value={item.description}
          onChange={e=>
            (v=>setItem(it=>({...it, description:v})))
              (e.currentTarget.value)
          }
        />
        <Autocomplete
          options={['1', '2', '3']}
          forcePopupIcon
          freeSolo
          filterOptions={(o) => o}
          onChange={(e, newValue) =>
            (v => setItem(it => ({ ...it, quantity: parseInt(v || '') || 0 })))
              (newValue)
          }
          value={(item.quantity||'').toString()}
          renderInput={(params) => <TextField sx={{appearance:'listbox'}}
            {...params}
            type='number'
            onKeyDown={e=>e.key == 'Backspace' || e.key == 'Delete' ? true : !isNaN(Number(e.key))}
            inputProps={{ ...params.inputProps }}
            placeholder="How many?" 
            onChange={(e) =>
              (v => setItem(it => ({ ...it, quantity: parseInt(v || '') || 0 })))
                (e.currentTarget.value)
            }
            value={(item.quantity||'').toString()}
            onBlur={e=>e.currentTarget.value=(item.quantity||'').toString()}
          />}
        />
        </Stack>
      </Box>
      <Stack flexShrink={1} spacing={2} direction='row' justifyContent='flex-end' sx={{padding:'20px'}}>
        <Button variant='text' onClick={()=>navigate(-1)}>Cancel</Button>
        {/* Mock says 'Add Task' */}
        <Button variant='contained' disabled={submitting} onClick={submit}>Add Item</Button>
      </Stack>
      <Box sx={{ height: '5px', backgroundColor:'#4D81B7'}}></Box>
    </Drawer>
  );
}
