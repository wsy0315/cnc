import classNames from 'classnames';
import React from 'react';
import i18n from '../../../lib/i18n';
import { Widget, WidgetHeader, WidgetContent } from '../../widget';
import Spindle from './Spindle';
import './index.css';

class SpindleWidget extends React.Component {
    static propTypes = {
        onDelete: React.PropTypes.func
    };
    state = {
        isCollapsed: false,
        isFullscreen: false
    };

    handleClick(target, val) {
        const handler = {
            'toggle': () => {
                this.setState({ isCollapsed: !!val });
            },
            'fullscreen': () => {
                this.setState({ isFullscreen: !!val });
            },
            'delete': () => {
                this.props.onDelete();
            }
        }[target];

        handler && handler();
    }
    render() {
        let title = i18n._('Spindle');
        let controlButtons = [
            'toggle',
            'fullscreen',
            'delete'
        ];
        let classes = {
            widgetContent: classNames(
                { 'hidden': this.state.isCollapsed }
            )
        };

        return (
            <div {...this.props} data-ns="widgets/spindle">
                <Widget fullscreen={this.state.isFullscreen}>
                    <WidgetHeader
                        title={title}
                        controlButtons={controlButtons}
                        onClick={::this.handleClick}
                    />
                    <WidgetContent className={classes.widgetContent}>
                        <Spindle />
                    </WidgetContent>
                </Widget>
            </div>
        );
    }
}

export default SpindleWidget;