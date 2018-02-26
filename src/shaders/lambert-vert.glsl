#version 300 es

//This is a vertex shader. While it is called a "shader" due to outdated conventions, this file
//is used to apply matrix transformations to the arrays of vertex data passed to it.
//Since this code is run on your GPU, each vertex is transformed simultaneously.
//If it were run on your CPU, each vertex would have to be processed in a FOR loop, one at a time.
//This simultaneous transformation allows your program to run much faster, especially when rendering
//geometry with millions of vertices.

uniform mat4 u_Model;       // The matrix that defines the transformation of the
                            // object we're rendering. In this assignment,
                            // this will be the result of traversing your scene graph.

uniform mat4 u_ModelInvTr;  // The inverse transpose of the model matrix.
                            // This allows us to transform the object's normals properly
                            // if the object has been non-uniformly scaled.

uniform mat4 u_ViewProj;    // The matrix that defines the camera's transformation.
                            // We've written a static matrix for you to use for HW2,
                            // but in HW3 you'll have to generate one yourself

in vec4 vs_Pos;             // The array of vertex positions passed to the shader

in vec4 vs_Nor;             // The array of vertex normals passed to the shader

in vec4 vs_Col;             // The array of vertex colors passed to the shader.

uniform float u_IsInstance;

in vec4 vs_Translation;
in vec4 vs_Quaternion;
in vec3 vs_Scale;

out vec4 fs_Nor;            // The array of normals that has been transformed by u_ModelInvTr. This is implicitly passed to the fragment shader.
out vec4 fs_LightVec;       // The direction in which our virtual light lies, relative to each vertex. This is implicitly passed to the fragment shader.
out vec4 fs_Col;            // The color of each vertex. This is implicitly passed to the fragment shader.

const vec4 lightPos = vec4(500, 500, -300, 1); //The position of our virtual light, which is used to compute the shading of
                                        //the geometry in the fragment shader.

mat4 rotation() {
  mat4 result;

  normalize(vs_Quaternion);

  float qx = vs_Quaternion[0];
  float qy = vs_Quaternion[1];
  float qz = vs_Quaternion[2];
  float qw = vs_Quaternion[3];

  result[0] = vec4(1.f - 2.f*qy*qy - 2.f*qz*qz, 2.f*qx*qy + 2.f*qz*qw, 2.f*qx*qz - 2.f*qy*qw, 0.f);
  result[1] = vec4(2.f*qx*qy - 2.f*qz*qw, 1.f - 2.f*qx*qx - 2.f*qz*qz, 2.f*qy*qz + 2.f*qx*qw, 0.f);
  result[2] = vec4(2.f*qx*qz + 2.f*qy*qw, 2.f*qy*qz - 2.f*qx*qw, 1.f - 2.f*qx*qx - 2.f*qy*qy, 0.f);
  result[3] = vec4(0.f,0.f,0.f,1.f);

  return result;
}

vec3 qtransform( vec4 q, vec3 v ){ 
	return v + 2.0*cross(cross(v, q.xyz ) + q.w*v, q.xyz);
	}

mat4 rotationMatrix(vec3 axis, float angle)
{
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

void main()
{
    fs_Col = vs_Col;                         // Pass the vertex colors to the fragment shader for interpolation

    mat3 invTranspose = mat3(u_ModelInvTr);
    fs_Nor = vec4(invTranspose * vec3(vs_Nor), 0);          // Pass the vertex normals to the fragment shader for interpolation.
                                                            // Transform the geometry's normals by the inverse transpose of the
                                                            // model matrix. This is necessary to ensure the normals remain
                                                            // perpendicular to the surface after the surface is transformed by
                                                            // the model matrix.


    vec4 modelposition = u_Model * vs_Pos;   // Temporarily store the transformed vertex positions for use below

    if(u_IsInstance == 1.f) {
      modelposition = vec4(modelposition[0] * vs_Scale[0], modelposition[1] * vs_Scale[1], modelposition[2] * vs_Scale[2], modelposition[3]);

      vec4 temp = normalize(vs_Quaternion);

      float angle = 2.f * acos(temp[3]);
      float s = sin(angle/2.f);
      float p = vs_Quaternion[0];
      float p2 = vs_Quaternion[1];
      float p3 = vs_Quaternion[2];
      //vec3 axisasasd = vec3(p, p2, p3);

      //modelposition = inverse(rotationMatrix(axis, angle)) * modelposition;


      modelposition = modelposition + vs_Translation;

    }

    fs_LightVec = lightPos - modelposition;  // Compute the direction in which the light source lies

    gl_Position = u_ViewProj * modelposition;// gl_Position is a built-in variable of OpenGL which is
                                             // used to render the final positions of the geometry's vertices
}
