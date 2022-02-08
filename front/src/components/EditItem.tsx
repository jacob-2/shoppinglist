import { LastPage } from "@mui/icons-material";
import { Autocomplete, Box, Button, Checkbox, Drawer, FormControlLabel, IconButton, InputAdornment, MenuItem, Select, Stack, TextField, Toolbar, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ItemsAPI, Item } from "../api/items";
import Spinner from './Spinner';


interface Props {
  open: boolean;
  id?: number;
  callback: (item: Item) => void;
}
export default function EditItem({open, id, callback}:Props) {
  const navigate = useNavigate();

  const [item, setItem] = useState<Item | null>(null);
  const setItemProperty = (updates: Partial<Item>) =>
    setItem(it => !it ? null : ({ ...it, ...updates }));

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [inputErrors, setInputErrors] = useState<{title?:boolean}>({});

  // Enables "quick-hiding" when creating an item (no sliding animation)
  const [hidden, setHidden] = useState(false);
  useEffect(()=>{
    if(open) setHidden(false);
  }, [open]);

  useEffect(()=>{
    if(id) ItemsAPI.getItem(id).then(res=>{
      if('error' in res) {
        setError(res.error);
      } else {
        setItem(res.data);
      }
    });
  }, [id]);

  useEffect(()=>{
    if(!!error) {
      // TODO: better error handling
      alert(error);
      window.location.reload();
    }
  }, [error]);

  const clear = () => {
    setItem(null);
    setError('');
    setInputErrors({});
  }

  const validate = () => {
    if (!item || !item.title) {
      setInputErrors(errs=>({...errs, title: true}));
      return false;
    }
    return true;
  }
  useEffect(()=>{
    setInputErrors({});
  }, [item]);

  const submit = ()=>{
    if (submitting || !item || !validate()) return;
    setSubmitting(true);
    ItemsAPI.updateItem(item).then(r=>{
      setSubmitting(false);
      if(r && 'error' in r) setError(r.error);
      else {
        navigate('/');
        setHidden(true);
        callback(item);
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
      { !item ? <Spinner />
      : <>
        <Box
          flexGrow={1}
          sx={{
            padding: '30px',
            width: '560px',
            maxWidth: '90vw',
          }}
        >
          <Typography variant="h2">Edit an Item</Typography>
          <Typography variant="subtitle1">Edit your item below</Typography>
              <Stack component='form' autoComplete="off" spacing={2} alignItems='stretch' sx={{my:'13px'}}>
              <TextField placeholder='Item Name' value={item.title}
                  error={!!inputErrors.title}
                  onChange={e => 
                    (v => setItemProperty({ title: v }))
                      (e.currentTarget.value)
                  }
              />
              <TextField placeholder='Description' multiline rows={4}
                inputProps={{ maxLength: 100 }}
                InputProps={{
                  endAdornment: <InputAdornment
                    position='end'
                    sx={{alignSelf: 'flex-end', width: 0}}>
                    <Typography variant='caption' sx={{width:'60px', textAlign:'right', ml:'-60px'}}>
                      {`${item?.description?.length}/100`}
                    </Typography>
                  </InputAdornment>,
                }}
                value={item.description}
                onChange={e=>
                  (v => setItemProperty({description:v}))
                    (e.currentTarget.value)
                }
              />
              <Autocomplete
                options={['1', '2', '3']}
                forcePopupIcon
                freeSolo
                filterOptions={(o) => o}
                onChange={(e, newValue) =>
                  (v => setItemProperty({quantity: parseInt(v || '') || 0 }))
                    (newValue)
                }
                value={(item.quantity||'').toString()}
                renderInput={(params) => <TextField sx={{appearance:'listbox'}}
                  {...params}
                  inputProps={{ ...params.inputProps, inputMode: 'numeric', pattern: '[0-9]*' }}
                  placeholder="How many?" 
                  onChange={(e) =>
                    (v => setItemProperty({quantity: parseInt(v || '') || 0 }))
                      (e.currentTarget.value)
                  }
                  value={(item.quantity||'').toString()}
                  onBlur={e=>e.currentTarget.value=(item.quantity||'').toString()}
                />}
              />
              <FormControlLabel control={
                <Checkbox checked={item.purchased} onChange={
                  ()=>{setItemProperty({purchased:!item.purchased})}
                } />
              } label='Purchased' />
            </Stack>
          </Box>
          <Stack flexShrink={1} spacing={2} direction='row' justifyContent='flex-end' sx={{padding:'20px'}}>
            <Button variant='text' onClick={()=>navigate(-1)}>Cancel</Button>
            {/* Mock says 'Add Task' */}
            <Button variant='contained' disabled={submitting} onClick={submit}>Save Item</Button>
          </Stack>
        </>}
      <Box sx={{ height: '5px', backgroundColor:'#4D81B7'}}></Box>
    </Drawer>
  );
}
