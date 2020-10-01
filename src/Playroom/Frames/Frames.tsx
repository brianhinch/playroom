import React, { useRef } from 'react';
import flatMap from 'lodash/flatMap';
import Iframe from './Iframe';
import { compileJsx } from '../../utils/compileJsx';
import { PlayroomProps } from '../Playroom';
import { Strong } from '../Strong/Strong';
import { Text } from '../Text/Text';
import playroomConfig from '../../config';
import frameSrc from './frameSrc';
import SnapshotButton from '../SnapshotButton/SnapshotButton';
import ShareIcon from '../icons/ShareIcon';

// @ts-ignore
import styles from './Frames.less';

interface FramesProps {
  code: string;
  themes: PlayroomProps['themes'];
  widths: PlayroomProps['widths'];
}

export default function Frames({ code, themes, widths }: FramesProps) {
  const scrollingPanelRef = useRef<HTMLDivElement | null>(null);

  const frames = flatMap(widths, (width) =>
    themes.map((theme) => ({
      theme,
      width,
      widthName: `${width}${/\d$/.test(width.toString()) ? 'px' : ''}`,
    }))
  );

  let renderCode = code;

  try {
    renderCode = compileJsx(code);
  } catch (e) {
    renderCode = '';
  }

  return (
    <div ref={scrollingPanelRef} className={styles.root}>
      {frames.map((frame) => {
        const frameId = `frame-${frame.theme.replace(/\ /g, '')}-${
          frame.widthName
        }`;
        return (
          <div
            key={`${frame.theme}_${frame.width}`}
            className={styles.frameContainer}
          >
            <div className={styles.frameActions} data-testid="frameActions">
              <SnapshotButton frameId={frameId} format="png">
                Copy as PNG <ShareIcon />
              </SnapshotButton>
            </div>
            <div className={styles.frame}>
              <div className={styles.frameBorder} />
              <Iframe
                intersectionRootRef={scrollingPanelRef}
                id={frameId}
                src={frameSrc(
                  { themeName: frame.theme, code: renderCode },
                  playroomConfig
                )}
                className={styles.frame}
                style={{ width: frame.width }}
                data-testid="previewFrame"
              />
            </div>
            <div className={styles.frameName} data-testid="frameName">
              {frame.theme === '__PLAYROOM__NO_THEME__' ? (
                <Text weight="strong">{frame.widthName}</Text>
              ) : (
                <Text>
                  <Strong>{frame.theme}</Strong>
                  {` \u2013 ${frame.widthName}`}
                </Text>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
