import React, { Component } from 'react';
import {
  Layout, Menu, Icon, Button,
} from 'antd';
import { Link, withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';
import { getGroups } from '../../apollo/gql/groups';
import user from '../../apollo/gql/user';
import Loading from '../Loading';
import './style.css';

const { Header, Sider } = Layout;

class AppLayout extends Component {
  constructor(props) {
    super(props);
    this.menuData = [
      {
        key: 1,
        link: '/cards',
        iconType: 'barcode',
        title: 'Изделия',
        rights: ['admin', 'user'],
      },
      {
        key: 2,
        link: '/groups',
        iconType: 'profile',
        title: 'Группы',
        rights: ['admin'],
      },
      {
        key: 3,
        link: '/workers',
        iconType: 'user',
        title: 'Сотрудники',
        rights: ['admin'],
      },
      {
        key: 4,
        link: '/customers',
        iconType: 'smile-o',
        title: 'Заказчики',
        rights: ['admin'],
      },
      {
        key: 5,
        link: '/production',
        iconType: 'table',
        title: 'Продукция',
        rights: ['admin', 'user'],
      },
      {
        key: 6,
        link: '/reports',
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
          <Query query={user} fetchPolicy="network-only">
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
                    {this.props.children}
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
