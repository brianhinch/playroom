import React, { IframeHTMLAttributes } from 'react';
import domtoimage from 'dom-to-image';
import { Button } from '../Button/Button';

interface SnapshotButtonProps {
  frameId: string;
  children: any;
}
const convertDataURIToBinary = (dataURI: string) => {
  const BASE64_MARKER = ';base64,';
  const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
  const base64 = dataURI.substring(base64Index);
  const raw = window.atob(base64);
  const rawLength = raw.length;
  const array = new Uint8Array(new ArrayBuffer(rawLength));

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
};

export default function Frames({ frameId, children }: SnapshotButtonProps) {
  return (
    <Button
      onClick={(e) => {
        const container:
          | IframeHTMLAttributes<HTMLElement>
          | any = document.getElementById(frameId);
        if (container) {
          // eslint-disable-next-line no-console
          console.log(e, e.clipboardData, container);
          domtoimage
            .toPng(container.contentDocument.body)
            .then((dataUrl) => {
              if (navigator && navigator.clipboard) {
                navigator.clipboard
                  .write([
                    new ClipboardItem({
                      'image/png': new Blob(
                        [convertDataURIToBinary(dataUrl).buffer],
                        {
                          type: 'image/png',
                        }
                      ),
                    }),
                  ])
                  .then(
                    function () {
                      // eslint-disable-next-line no-console
                      console.log(
                        'Async: Copying to clipboard was successful!'
                      );
                    },
                    function (err: any) {
                      // eslint-disable-next-line no-console
                      console.error('Async: Could not copy text: ', err);
                    }
                  );
              }
            })
            .catch(function (error) {
              // eslint-disable-next-line no-console
              console.error('error when rendering screenshot', error);
            });
        }
      }}
    >
      {children}
    </Button>
  );
}
