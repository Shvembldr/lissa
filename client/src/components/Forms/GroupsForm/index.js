import React from 'react';
import {
  Form, Input, Button, message,
} from 'antd';
import { Mutation } from 'react-apollo';
import { createGroup, getGroups } from '../../../apollo/gql/groups';
import formHasErrors from '../../../utils/formHasErrors';

const FormItem = Form.Item;

const updateCache = (cache, { data: { createGroup } }) => {
  const { groups } = cache.readQuery({ query: getGroups });
  cache.writeQuery({
    query: getGroups,
    data: { groups: [createGroup, ...groups] },
  });
};

class GroupsForm extends React.Component {
  componentDidMount() {
    this.props.form.validateFields();
  }

  render() {
    const {
      getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
    } = this.props.form;
    const nameError = isFieldTouched('name') && getFieldError('name');
    return (
      <Mutation mutation={createGroup} update={updateCache}>
        {(createGroup, { loading }) => (
          <Form
            layout="inline"
            onSubmit={(e) => {
              e.preventDefault();
              this.props.form.validateFields(async (err, values) => {
                if (!err) {
                  try {
                    await createGroup({
                      variables: { input: { name: values.name } },
                    });
                    message.success('Группа добавлена');
                    this.props.form.resetFields();
                  } catch (e) {
                    message.error('Возникли сложности');
                    console.log(e);
                  }
                }
              });
            }}>
            <FormItem validateStatus={nameError ? 'error' : ''} help={''}>
              {getFieldDecorator('name', {
                rules: [{ required: true, max: 24 }],
              })(<Input placeholder="Название" />)}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={formHasErrors(getFieldsError())}>
                Добавить группу
              </Button>
            </FormItem>
          </Form>
        )}
      </Mutation>
    );
  }
}

const WrappedGroupsForm = Form.create()(GroupsForm);

export default WrappedGroupsForm;
