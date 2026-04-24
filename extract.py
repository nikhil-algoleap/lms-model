import zipfile
import xml.etree.ElementTree as ET

with zipfile.ZipFile(r'c:\Users\Nikhil Yedugani\Desktop\Lms\Algoleap_LMS_Technical_Spec_v1.docx') as docx:
    tree = ET.fromstring(docx.read('word/document.xml'))
    namespaces = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    paragraphs = []
    for paragraph in tree.findall('.//w:p', namespaces):
        texts = [node.text for node in paragraph.findall('.//w:t', namespaces) if node.text]
        if texts:
            paragraphs.append(''.join(texts))

with open(r'c:\Users\Nikhil Yedugani\Desktop\Lms\Algoleap_LMS_Technical_Spec_v1.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(paragraphs))
