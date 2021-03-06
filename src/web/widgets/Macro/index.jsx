import _ from 'lodash';
import classNames from 'classnames';
import pubsub from 'pubsub-js';
import React, { Component, PropTypes } from 'react';
import CSSModules from 'react-css-modules';
import api from '../../api';
import Widget from '../../components/Widget';
import controller from '../../lib/controller';
import i18n from '../../lib/i18n';
import Macro from './Macro';
import {
    MODAL_STATE_NONE
} from './constants';
import styles from './index.styl';

@CSSModules(styles, { allowMultiple: true })
class MacroWidget extends Component {
    static propTypes = {
        onDelete: PropTypes.func
    };
    static defaultProps = {
        onDelete: () => {}
    };

    pubsubTokens = [];

    constructor() {
        super();
        this.state = this.getDefaultState();
    }
    componentDidMount() {
        this.subscribe();

        // Fetch the list of macros
        this.listMacros();
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !_.isEqual(nextProps, this.props) || !_.isEqual(nextState, this.state);
    }
    getDefaultState() {
        return {
            isCollapsed: false,
            isFullscreen: false,
            port: controller.port,
            workflowState: controller.workflowState,
            macros: [],
            modalState: MODAL_STATE_NONE,
            modalParams: {}
        };
    }
    subscribe() {
        const tokens = [
            pubsub.subscribe('port', (msg, port) => {
                port = port || '';

                if (port) {
                    this.setState({ port: port });
                } else {
                    this.setState({ port: '' });
                }
            }),
            pubsub.subscribe('workflowState', (msg, workflowState) => {
                this.setState({ workflowState: workflowState });
            })
        ];
        this.pubsubTokens = this.pubsubTokens.concat(tokens);
    }
    unsubscribe() {
        _.each(this.pubsubTokens, (token) => {
            pubsub.unsubscribe(token);
        });
        this.pubsubTokens = [];
    }
    openModal(modalState = MODAL_STATE_NONE, modalParams = {}) {
        this.setState({
            modalState: modalState,
            modalParams: modalParams
        });
    }
    closeModal() {
        this.setState({
            modalState: MODAL_STATE_NONE,
            modalParams: {}
        });
    }
    async listMacros() {
        try {
            let res;
            res = await api.listMacros();
            const macros = res.body;
            this.setState({ macros: macros });
        } catch (err) {
            // FIXME
        }
    }
    async addMacro({ name, content }) {
        try {
            let res;
            res = await api.addMacro({ name, content });
            res = await api.listMacros();
            const macros = res.body;
            this.setState({ macros: macros });
        } catch (err) {
            // FIXME
        }
    }
    async deleteMacro({ id }) {
        try {
            let res;
            res = await api.deleteMacro({ id });
            res = await api.listMacros();
            const macros = res.body;
            this.setState({ macros: macros });
        } catch (err) {
            // FIXME
        }
    }
    async updateMacro({ id, name, content }) {
        try {
            let res;
            res = await api.updateMacro({ id, name, content });
            res = await api.listMacros();
            const macros = res.body;
            this.setState({ macros: macros });
        } catch (err) {
            // FIXME
        }
    }
    render() {
        const { isCollapsed, isFullscreen } = this.state;
        const state = {
            ...this.state
        };
        const actions = {
            openModal: ::this.openModal,
            closeModal: ::this.closeModal,
            addMacro: ::this.addMacro,
            updateMacro: ::this.updateMacro,
            deleteMacro: ::this.deleteMacro
        };

        return (
            <Widget {...this.props} fullscreen={isFullscreen}>
                <Widget.Header>
                    <Widget.Title>{i18n._('Macro')}</Widget.Title>
                    <Widget.Controls>
                        <Widget.Button
                            type="toggle"
                            defaultValue={isCollapsed}
                            onClick={(event, val) => this.setState({ isCollapsed: !!val })}
                        />
                        <Widget.Button
                            type="fullscreen"
                            defaultValue={isFullscreen}
                            onClick={(event, val) => this.setState({ isFullscreen: !!val })}
                        />
                        <Widget.Button
                            type="delete"
                            onClick={(event) => this.props.onDelete()}
                        />
                    </Widget.Controls>
                </Widget.Header>
                <Widget.Content
                    styleName={classNames(
                        'widget-content',
                        { 'hidden': isCollapsed }
                    )}
                >
                    <Macro
                        state={state}
                        actions={actions}
                    />
                </Widget.Content>
            </Widget>
        );
    }
}

export default MacroWidget;
