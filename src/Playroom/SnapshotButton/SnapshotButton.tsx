import React, { IframeHTMLAttributes } from 'react';
import domtoimage from 'dom-to-image';
import { Button } from '../Button/Button';

interface SnapshotButtonProps {
  frameId: string;
  children: any;
  format: 'png' | 'svg';
}

// const snapshotMimeType = 'image/png';
// const conversionFcn = domtoimage.toPng;

const snapshotConfigs = {
  png: {
    mimeType: 'image/png',
    conversionFcn: domtoimage.toPng,
    isBinary: true,
  },
  svg: {
    mimeType: 'image/svg+xml',
    conversionFcn: domtoimage.toSvg,
    isBinary: false,
  },
};

const dataURIToString = (dataURI: string): string => {
  const MARKER = ',';
  const idx = dataURI.indexOf(MARKER);
  const offset = idx + MARKER.length;
  const payload = dataURI.substring(offset);
  return payload;
};

const base64DataURIToUint8Array = (dataURI: string): Uint8Array => {
  const base64 = dataURIToString(dataURI);
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
};

const sendToClipboard = (mimeType: string, data: any) => {
  if (navigator && navigator.clipboard) {
    navigator.clipboard
      .write([
        new ClipboardItem({
          [mimeType]: data,
        }),
      ])
      .then(
        function () {
          // eslint-disable-next-line no-console
          console.log('Async: Copying to clipboard was successful!');
        },
        function (err: any) {
          throw err;
        }
      );
  } else {
    throw Error('Clipboard API is not supported in this browser');
  }
};

const sendToClipboardFallback = (mimeType: string, dataURI: string) => {
  const tempId = `temp-${Math.random()}`.replace('.', '');
  const tempDiv: HTMLDivElement = document.createElement('div');
  tempDiv.id = tempId;
  const tempImg: HTMLImageElement = document.createElement('img');
  tempDiv.appendChild(tempImg);

  tempImg.src = dataURI;

  document.body.appendChild(tempDiv);

  if (document.body.createTextRange) {
    const range = document.body.createTextRange();
    range.moveToElementText(tempDiv);
    range.select();
  } else if (window.getSelection) {
    const selection: any = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(tempDiv);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  document.execCommand('copy');

  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  }

  // document.body.removeChild(tempDiv);
};

export default function Frames({
  frameId,
  children,
  format,
}: SnapshotButtonProps) {
  return (
    <Button
      onClick={() => {
        const container:
          | IframeHTMLAttributes<HTMLElement>
          | any = document.getElementById(frameId);
        if (container) {
          snapshotConfigs[format]
            .conversionFcn(container.contentDocument.body)
            .then((dataURI) => {
              try {
                sendToClipboard(
                  snapshotConfigs[format].mimeType,
                  new Blob(
                    [
                      snapshotConfigs[format].isBinary
                        ? base64DataURIToUint8Array(dataURI).buffer
                        : dataURIToString(dataURI),
                    ],
                    {
                      type: snapshotConfigs[format].mimeType,
                    }
                  )
                );
              } catch (error) {
                sendToClipboardFallback(
                  snapshotConfigs[format].mimeType,
                  dataURI
                );
              }
            })
            .catch(function (error) {
              // eslint-disable-next-line no-console
              console.error('Cannot copy screenshot: ', error);
            });
        }
      }}
    >
      {children}
    </Button>
  );
}
