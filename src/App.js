import React, { Component } from 'react';
import './App.css';



/* LLa modificación de los atributos del objeto state de cada componente se realiza siempre
   en un método, ese método se llama en un botón o en un link
   
   En el componente Comment, pongo los condicionales dentro del render.
   En el componente CommentBox pongo los condicionales en un método y le paso
   los argumentos que necesite
*/
class Comment extends Component {

  constructor () {
    super();

    this.state = {isAbusive: false} 

  }

  render() {

    let commentBody;
    var textoReportar;

    if (this.state.isAbusive===false) {

      commentBody = this.props.body;
      textoReportar = "Reportar Comentario";

    } else {

      commentBody = <em>Contenido marcado como abusivo</em>
      textoReportar = "Deshacer";

    }

   return (

    <div className="comment">
       
      <img src={this.props.route} alt={`${this.props.author}'s imagen`}/> 
      <p className="comment-header">{this.props.author}</p>
      <p className="comment-body">{commentBody}</p>

      <div className="comment-actions">
        <a onClick={this._handleDelete.bind(this)} href="#">Delete comment</a>
        <br/>
        <a onClick={this._toggleAbuse.bind(this)} href="#">{textoReportar}</a>
      </div>


    </div>

   );

  }

  _toggleAbuse (event){
    event.preventDefault(); //previene que la página se recargue cuando das click en un link

    this.setState({isAbusive: !this.state.isAbusive});

  }
   
  _handleDelete (event){

    event.preventDefault();



    this.props.deleteComment(this.props.body);

  }

  }
  
class CommentBox extends Component {

  constructor () {
    super();

    this.state = {mostrarComentarios: true,
                  comments: [

                    {id: 1, author: "Anne Droid", body: "I wanna know what love is", rutaImg:'prueba/5.png'  },
                    {id: 2, author: "Io easy", body: "I know you can show me" , rutaImg:"prueba/4.png"},
                    {id: 3, author: "Ilian", body: "Par de maricas" , rutaImg:"prueba/3.png"}  

                  ]};

  }

  render () {
   
    const comentariosPo = this._consumirComentarios ();
    const cifra = this._evaluarComentarios(comentariosPo.length);
    const mostrarlos = this._mostrarLista(comentariosPo,this.state.mostrarComentarios);
    var textoBoton;

    if (this.state.mostrarComentarios===true){
      textoBoton = "Ocultar Comentarios";
    } else {
      textoBoton = "Mostrar Comentarios";
    }

    return (
  
      <div className="comment-box">
         <CommentForm addComment={this._addComment.bind(this)}/>
         <button className="myButton" onClick={this._clickLista.bind(this)}>{textoBoton}</button>
         <h3>Comments</h3>
         <h4>{cifra} </h4>
         {mostrarlos}

      </div>
  
    );
  
  }

  //este método se dispara por CommentForm cuando un nuevo comentario es añadido

  _addComment (elAuthor, elBody) {

    const comment = {id: this.state.comments.lenght +1,
                     rutaImg:"cero.png",
                     author:elAuthor,
                     body:elBody};

    this.setState({comments: this.state.comments.concat([comment])});

  }

  _deleteComment (body) {


    for (var i = 0; i < this.state.comments.length; i++){

      if (this.state.comments[i].body == body) {

        this.state.comments.splice(i,1);
        this.forceUpdate();

     
      
      }

    }
    
      
  }

  _mostrarLista (losComents,mostrar){

    if (mostrar){

      return <div className="comment-list">{losComents}</div>;

    } 

  }

  _clickLista () {

    this.setState ({
      mostrarComentarios: !this.state.mostrarComentarios
    });

  }

  _evaluarComentarios (tamanio) {
     
     if (tamanio== undefined){
       return "no puedo leer esto"
     }
    
      if (tamanio===0){
        return "No comments yet";
      } else if (tamanio===1) {
        return "1 comment"
      }else {
        return `there's ${tamanio} comments`;
      }
  }

  _consumirComentarios () {


   return this.state.comments.map((elemento) => <Comment deleteComment={this._deleteComment.bind(this)} author={elemento.author} body={elemento.body} id={elemento.id} route={elemento.rutaImg}/>);
                                                
  }

  }

/*  commentForm es un componente que tiene un formulario de inputs de usuario.

    Cuando el botón de submit es tocado, los datos de ese formulario pueden
    ser accedidos gracias al ref en el método  _handleSubmit que a su vez
    llama al método _addComment de la clase padre CommentBox y en la misma
    linea lo convierte en un atributo para su propio componente, es decir <CommentForm addComment =.../>

    Cuando el método _addComment de la clase padre es llamado y ejecutado en la clase hija, esta
    indirectamente edita el objeto state de la clase padre.

*/

class CommentForm extends Component {

  constructor () {
    super ();

    this.state = {
      characters: 0
    } 

  }

  // en cada input del form, se genera un método en el campo "ref" que usa react para enviar información de inputs a variables globales

  render () {
    return (

      <form className="comment-form" onSubmit={this._handleSubmit.bind(this)}>
        <h3>Join The Discussion</h3>
        <div className="comment-form-fields">
          <input className="areas" placeholder="Name:" ref={(input) => this._author = input}/>
          <br/>
          <textarea maxlength="140" onKeyUp={this._contadorDeCaracteres.bind(this)} className="areas" placeholder="Comment:" ref={(textarea) => this._body = textarea}></textarea>
          <p>{"Caracteres restantes: " + (-this.state.characters+140)}</p>
        </div>
        <div className="comment-form-actions">
          <button className="myButton2" type="submit">Post Comment</button>
        </div>

      </form>

    );
  }

  // en el siguiente método adquiero la información de los inputs y las guardo en variables
  // luego llamo un método de mi padre y le doy como argumento los valores de dichos inputs

  _handleSubmit (event){

    event.preventDefault();
    let author = this._author;
    let body = this._body;


    if (!author.value || !body.value ) {

      alert ("No se permiten espacios vacíos");

    } else {

      this.props.addComment (author.value, body.value); //addComment hace referencia a un método propiedad de CommentBox.
  
    }

    

  }

  _contadorDeCaracteres () {

   this.setState({characters: this._body.value.length}); 

  }

  }

export default CommentBox;
