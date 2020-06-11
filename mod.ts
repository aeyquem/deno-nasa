import {
  Application,
  ListenOptions,
} from "https://deno.land/x/oak@v5.0.0/mod.ts";

const app = new Application();
const listenOptions: ListenOptions = { port: 8000 };

app.use((ctx) => {
  ctx.response.body = `
      {___     {__      {_         {__ __        {_       
      {_ {__   {__     {_ __     {__    {__     {_ __     
      {__ {__  {__    {_  {__     {__          {_  {__    
      {__  {__ {__   {__   {__      {__       {__   {__   
      {__   {_ {__  {______ {__        {__   {______ {__  
      {__    {_ __ {__       {__ {__    {__ {__       {__ 
      {__      {__{__         {__  {__ __  {__         {__
                      Mission Control API`;
});

if (import.meta.main) {
  console.log("listening on port: " + listenOptions.port);
  await app.listen(listenOptions);
}
