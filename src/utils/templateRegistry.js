import Template7 from '../components/templates/Template7';

export const templates = [
  { name: 'Template 7', component: Template7 },
];

export const getTemplate = (templateNumber) => {
  return Template7; // Always return Template7
};
