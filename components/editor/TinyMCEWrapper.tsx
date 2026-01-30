'use client';

import React, { useRef, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Editor as TinyMCEEditor } from 'tinymce';

interface TinyMCEWrapperProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    height?: number;
    placeholder?: string;
}

export default function TinyMCEWrapper({
    value,
    onChange,
    disabled = false,
    height = 500,
    placeholder = 'Start writing...'
}: TinyMCEWrapperProps) {
    const editorRef = useRef<TinyMCEEditor | null>(null);

    // TinyMCE configuration
    const initConfig = {
        height,
        menubar: true,
        plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
            'emoticons', 'quickbars'
        ],
        toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help | link image media table | emoticons',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        skin: 'oxide',
        content_css: 'default',
        placeholder,
        images_upload_url: '/api/upload', // You'll need to create this API endpoint
        automatic_uploads: true,
        file_picker_types: 'image',
        file_picker_callback: (cb: any, value: any, meta: any) => {
            // Implement file picker callback
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.addEventListener('change', (e: any) => {
                const file = e.target.files[0];

                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    /*
                      Note: Now we need to register the blob in TinyMCEs image blob
                      registry. In the next release this part hopefully won't be
                      necessary, as we are looking to handle it internally.
                    */
                    const id = 'blobid' + (new Date()).getTime();
                    const blobCache = editorRef.current?.editorUpload?.blobCache;
                    const base64 = (reader.result as string).split(',')[1];
                    const blobInfo = blobCache?.create(id, file, base64);
                    if (blobInfo) {
                        blobCache?.add(blobInfo);
                        cb(blobInfo.blobUri(), { title: file.name });
                    } else {
                        console.error('Failed to create blobInfo for TinyMCE upload');
                    }


                    /* call the callback and populate the Title field with the file name */
                    cb(blobInfo?.blobUri(), { title: file.name });
                });
                reader.readAsDataURL(file);
            });

            input.click();
        },
        quickbars_insert_toolbar: 'quicktable image media',
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
        contextmenu: 'link image table',
        branding: false,
        promotion: false,
        statusbar: true,
        elementpath: true,
        resize: true,
        paste_data_images: true,
        image_caption: true,
        image_advtab: true,
        link_assume_external_targets: true,
        link_title: false,
        target_list: false,
        link_list: [],
        rel_list: [],
        media_live_embeds: true,
        emoticons_database: 'emojis',
        emoticons_images_url: '/tinymce/emojis/images/',
        setup: (editor: TinyMCEEditor) => {
            editor.on('init', () => {
                editorRef.current = editor;
            });
        }
    };

    return (
        <div className="tinymce-wrapper">
            <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={value}
                onEditorChange={onChange}
                init={initConfig}
                disabled={disabled}
            />

            <style jsx global>{`
        .tox-tinymce {
          border-radius: 0.5rem !important;
          border: 1px solid #d1d5db !important;
        }
        .dark .tox-tinymce {
          background-color: #374151 !important;
          border-color: #4b5563 !important;
        }
        .dark .tox .tox-tbtn {
          color: #d1d5db !important;
        }
        .dark .tox .tox-tbtn:hover {
          background-color: #4b5563 !important;
        }
        .dark .tox .tox-toolbar__primary {
          background-color: #374151 !important;
        }
        .dark .tox .tox-edit-area {
          background-color: #1f2937 !important;
        }
        .dark .tox .tox-statusbar {
          background-color: #374151 !important;
          border-color: #4b5563 !important;
        }
      `}</style>
        </div>
    );
}