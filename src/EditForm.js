import React, { useState, useEffect } from 'react';
import FormGroup from 'react-bootstrap/FormGroup';
import FormLabel from 'react-bootstrap/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import LoaderButton from './LoaderButton';

export default ({ fields, original, save, isLoading, joiningTables }) => {
  const [updated, setUpdated] = useState(original || {});

  useEffect(() => {
    setUpdated(original || {});
  }, [original]);

  const validateForm = () => {
    let valid = true;
    Object.keys(fields).forEach((key) => {
      const field = fields[key];
      if (field.required && (!updated[key] || updated[key].length === 0)) {
        valid = false;
      }
    });
    return valid;
  };

  return (
    <form onSubmit={(e) => save(e, updated)}>
      {Object.keys(fields).map((key) => (
        <FormGroup key={key} controlId={key}>
          <FormLabel>{fields[key].label}</FormLabel>
          {['text', 'number', 'email'].includes(fields[key].type) && (
            <FormControl
              value={updated[key] || ''}
              type={fields[key].type}
              onChange={e => setUpdated({ ...updated, [key]: e.target.value })}
            />
          )}
          {fields[key].type === 'textarea' && (
            <FormControl
              value={updated[key] || ''}
              as='textarea'
              rows='3'
              onChange={e => setUpdated({ ...updated, [key]: e.target.value })}
            />
          )}
          {fields[key].type === 'dropdown' && (
            <FormControl
              value={updated[key] || ''}
              as='select'
              onChange={e => setUpdated({ ...updated, [key]: e.target.value })}
            >
              <option value='' />
              {joiningTables[fields[key].joiningTable].map((item) => {
                const { joiningTableKey, joiningTableFieldNames } = fields[key];
                return (
                  <option key={item[joiningTableKey]} value={item[joiningTableKey]}>
                    {joiningTableFieldNames.map((fieldName) => item[fieldName]).join(' ')}
                  </option>
                );
              })}
            </FormControl>
          )}
        </FormGroup>
      ))}
      <LoaderButton
        block
        type='submit'
        size='lg'
        variant='primary'
        isLoading={isLoading}
        disabled={!validateForm()}
      >
        Save
      </LoaderButton>
    </form>
  );
};
