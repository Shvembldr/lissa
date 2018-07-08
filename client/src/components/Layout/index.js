import React, { Component } from 'react';
import {
  Layout, Menu, Icon, Button,
} from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import { getGroups } from '../../apollo/gql/groups';
import user from '../../apollo/gql/user';
import Loading from '../Loading';
import Products from '../Routes/Products';
import Reports from '../Routes/Reports';
import Cards from '../Routes/Cards';
import Groups from '../Routes/Groups';
import Workers from '../Routes/Workers';
import Customers from '../Routes/Customers';
import { AuthRoute } from '../AuthRoute';

import './style.css';

const { Header, Sider } = Layout;

class AppLayout extends Component {
  constructor(props) {
    super(props);
    this.menuData = [
      {
        key: 1,
        link: '/app/cards',
        iconType: 'barcode',
        title: 'Изделия',
        rights: ['admin', 'user'],
      },
      {
        key: 2,
        link: '/app/groups',
        iconType: 'profile',
        title: 'Группы',
        rights: ['admin'],
      },
      {
        key: 3,
        link: '/app/workers',
        iconType: 'user',
        title: 'Сотрудники',
        rights: ['admin'],
      },
      {
        key: 4,
        link: '/app/customers',
        iconType: 'smile-o',
        title: 'Заказчики',
        rights: ['admin'],
      },
      {
        key: 5,
        link: '/app/production',
        iconType: 'table',
        title: 'Продукция',
        rights: ['admin', 'user'],
      },
      {
        key: 6,
        link: '/app/reports',
        iconType: 'line-chart',
        title: 'Отчет',
        rights: ['admin'],
      },
    ];
  }

  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  logout = (e) => {
    e.preventDefault();
    localStorage.removeItem('x-token');
    localStorage.removeItem('x-refresh-token');
    this.props.history.push('/login');
  };

  getMenuKey = () => [
    this.menuData.find(item => item.link === this.props.history.location.pathname).key.toString(),
  ];

  getMenu = role => this.menuData.filter(item => item.rights.indexOf(role) !== -1);

  render() {
    return (
      <Query query={getGroups}>
        {({ loading: loadingOne, error: errorOne }) => (
          <Query query={user}>
            {({ loading: loadingTwo, error: errorTwo, data: { me } }) => {
              if (loadingOne || loadingTwo) return <Loading />;
              if (errorOne || errorTwo) return 'Error!';
              return (
                <Layout className="layout">
                  <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={this.getMenuKey()}>
                      {this.getMenu(me.role).map(item => (
                        <Menu.Item key={item.key}>
                          <Link to={item.link}>
                            <Icon type={item.iconType} />
                            <span>{item.title}</span>
                          </Link>
                        </Menu.Item>
                      ))}
                    </Menu>
                  </Sider>
                  <Layout>
                    <Header className="header">
                      <Icon
                        className="trigger"
                        type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.toggle}
                      />
                      <Button
                        className="logout-button"
                        type="primary"
                        icon="logout"
                        onClick={this.logout}>
                        Выйти
                      </Button>
                    </Header>
                    <AuthRoute roles={['admin', 'user']} path="/app/cards" component={Cards} />
                    <AuthRoute roles={['admin']} path="/app/groups" component={Groups} />
                    <AuthRoute roles={['admin']} path="/app/workers" component={Workers} />
                    <AuthRoute roles={['admin']} path="/app/customers" component={Customers} />
                    <AuthRoute
                      roles={['admin', 'user']}
                      path="/app/production"
                      component={Products}
                    />
                    <AuthRoute roles={['admin']} path="/app/reports" component={Reports} />
                  </Layout>
                </Layout>
              );
            }}
          </Query>
        )}
      </Query>
    );
  }
}

export default withRouter(AppLayout);
