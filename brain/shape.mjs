// Stylized cerebral surface: two hemispheres with a longitudinal fissure.
// Shared CPU/GPU mapping keeps the wire structure, particles and hit surface aligned.
export function brainPoint(x,y,z){
  const radius=Math.hypot(x,y,z)||1;
  x/=radius;y/=radius;z/=radius;
  const side=x<0?-1:1;
  const hx=2*Math.abs(x)-1;
  const ring=Math.sqrt(Math.max(0,1-hx*hx));
  const yz=Math.hypot(y,z)||1;
  const hy=y/yz*ring,hz=z/yz*ring;
  const a=hy*13+2.2*Math.sin(hz*5+hx*3)+.7*Math.sin(hx*11);
  const b=hz*14+1.8*Math.sin(hy*6-hx*4);
  const groove=Math.exp(-Math.pow(Math.sin(a)/.28,2));
  const secondary=Math.exp(-Math.pow(Math.sin(b)/.23,2));
  const fold=1-.105*groove-.048*secondary;
  // Broad frontal lobes; narrower lower/occipital contour.
  const lower=1-.13*Math.max(0,-hy);
  return [
    side*(.49+.465*hx*fold)*radius,
    (.88*hy*fold+.06*(1-hy*hy))*radius,
    (1.03*hz*fold*lower+.035*(1-hz*hz))*radius,
  ];
}

export function brainGeometry(geometry){
  const p=geometry.attributes.position;
  for(let i=0;i<p.count;i++)p.setXYZ(i,...brainPoint(p.getX(i),p.getY(i),p.getZ(i)));
  p.needsUpdate=true;
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

export const brainGLSL=`
vec3 brainPoint(vec3 p){
  float radius=max(length(p),0.0001);
  vec3 d=p/radius;
  float side=d.x<0.0?-1.0:1.0;
  float hx=2.0*abs(d.x)-1.0;
  float ring=sqrt(max(0.0,1.0-hx*hx));
  float yz=max(length(d.yz),0.0001);
  float hy=d.y/yz*ring;
  float hz=d.z/yz*ring;
  float a=hy*13.0+2.2*sin(hz*5.0+hx*3.0)+0.7*sin(hx*11.0);
  float b=hz*14.0+1.8*sin(hy*6.0-hx*4.0);
  float groove=exp(-pow(sin(a)/0.28,2.0));
  float secondary=exp(-pow(sin(b)/0.23,2.0));
  float fold=1.0-0.105*groove-0.048*secondary;
  float lower=1.0-0.13*max(0.0,-hy);
  return vec3(side*(0.49+0.465*hx*fold),0.88*hy*fold+0.06*(1.0-hy*hy),1.03*hz*fold*lower+0.035*(1.0-hz*hz))*radius;
}
`;
